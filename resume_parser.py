from fastapi import APIRouter, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.text_splitter import CharacterTextSplitter
import os
import io
import logging
import traceback
import PyPDF2
import re
import pandas as pd
from dotenv import load_dotenv

# ------------------ SETUP ------------------ #

load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Initialize Router
router = APIRouter(prefix="/parser", tags=["Resume Parser"])

# GROQ API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("❌ Missing GROQ_API_KEY in .env file")

# ------------------ HELPERS ------------------ #

def pdf_to_text(file_path):
    """Extract text from a single PDF file"""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return "".join([page.extract_text() or "" for page in reader.pages])
    except Exception as e:
        logger.error(f"Error reading {file_path}: {e}")
        return ""

def chunk_text(text: str, chunk_size: int = 4000):
    splitter = CharacterTextSplitter(separator="\n", chunk_size=chunk_size, chunk_overlap=200)
    chunks = splitter.split_text(text)
    return chunks[0] if chunks else text

async def extract_skills_from_text(llm, text: str) -> list:
    """Extract explicit technical skills using LLM"""
    prompt = PromptTemplate(
        input_variables=["text"],
        template="""
Extract only explicit *technical skills* from the following text.
Include programming languages, frameworks, databases, tools, and technologies.
Exclude job titles and soft skills.
Return a comma-separated list of skill names.

Text:
{text}
"""
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    result = chain.run({"text": text})
    skills = [s.strip() for s in result.split(",") if s.strip()]
    return list(set(skills))

# ------------------ ENDPOINT ------------------ #

@app.post("/compare-folder")
async def compare_folder(
    jd: UploadFile = File(...),
    folder_path: str = Form(...)
):
    """
    Compare uploaded JD PDF against all PDF resumes in a user-specified folder.
    """
    try:
        logger.info(f"📁 Using resumes folder: {folder_path}")

        if not os.path.exists(folder_path):
            return JSONResponse(status_code=400, content={"error": f"Folder not found: {folder_path}"})

        pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith(".pdf")]
        if not pdf_files:
            return JSONResponse(status_code=400, content={"error": "No PDF resumes found in the specified folder"})

        # Extract JD text
        jd_bytes = await jd.read()
        reader = PyPDF2.PdfReader(io.BytesIO(jd_bytes))
        jd_text = "".join([page.extract_text() or "" for page in reader.pages])
        jd_text = chunk_text(jd_text)

        # Initialize LLM
        llm = ChatGroq(
            temperature=0.3,
            model_name="llama-3.1-8b-instant",
            groq_api_key=GROQ_API_KEY,
        )

        # Extract JD skills
        jd_skills = await extract_skills_from_text(llm, jd_text)

        results = []

        # Compare with each resume
        for file_name in pdf_files:
            file_path = os.path.join(folder_path, file_name)
            text = chunk_text(pdf_to_text(file_path))

            # ----- Extract Candidate Info -----
            email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
            email = email_match.group(0) if email_match else "Not Found"

            # Improved Name Extraction (1st line heuristic + regex)
            lines = text.strip().split("\n")
            possible_name = lines[0].strip()
            name_match = re.search(r"^[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}$", possible_name)
            name = name_match.group(0) if name_match else possible_name[:40]

            # Extract resume skills
            resume_skills = await extract_skills_from_text(llm, text)
            matched = [s for s in resume_skills if s.lower() in [x.lower() for x in jd_skills]]
            missing = [s for s in jd_skills if s.lower() not in [x.lower() for x in resume_skills]]
            match_percent = round((len(matched) / max(len(jd_skills), 1)) * 100, 2)

            results.append({
                "Name": name.strip(),
                "Email": email.strip(),
                "Match %": match_percent,
                "Matched Skills": ", ".join(matched) or "None",
                "Missing Skills": ", ".join(missing) or "None",
                "Resume File": file_name,
            })

        # Sort results descending
        results.sort(key=lambda x: x["Match %"], reverse=True)

        # Save to Excel
        excel_path = os.path.join(folder_path, "comparison_results.xlsx")
        df = pd.DataFrame(results)
        df.to_excel(excel_path, index=False)

        return {
            "message": f"✅ Processed {len(pdf_files)} resumes successfully",
            "excel_path": excel_path,
            "results": results,
        }

    except Exception as e:
        logger.error(f"Error comparing resumes: {traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"error": str(e)})
