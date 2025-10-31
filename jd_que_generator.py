# jd_question_generator.py

import os
import json
from langchain_groq import ChatGroq
from dotenv import load_dotenv 
load_dotenv()
# --- Initialize your LLM ---
llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)


def get_ai_response(prompt: str) -> str:
    """
    Sends the prompt to the LLM and returns its text output.
    """
    try:
        response = llm.predict(prompt)
        return response
    except Exception as e:
        print(f"⚠️ Error calling LLM: {e}")
        return ""


def generate_questions_from_jd(jd_text: str) -> dict:
    """
    Generates structured interview questions (Basic, Intermediate, Advanced)
    from a given Job Description using LLM.
    """

    prompt = f"""
You are an expert **Technical Interview Panelist** for software engineering and IT roles.

Your job is to carefully read the following Job Description (JD) and generate interview questions that directly assess the candidate’s knowledge, skills, and practical understanding required for that position.

Here is the Job Description:
\"\"\"{jd_text}\"\"\"

Guidelines:
1. Only include questions directly relevant to the technologies, skills, tools, or frameworks mentioned in the JD.
2. Avoid general HR or behavioral questions.
3. Ensure the questions test **technical knowledge, reasoning, and hands-on understanding**.
4. Group questions into three categories:
   - **Basic:** Checks fundamental and conceptual knowledge.
   - **Intermediate:** Tests applied understanding and real-world use.
   - **Advanced:** Focuses on problem-solving, optimization, and system-level thinking.
5. Each category must contain at least **3 questions**.
6. Return output **strictly in valid JSON format** as shown below:
{{
    "basic": ["Q1", "Q2", "Q3", ...],
    "intermediate": ["Q1", "Q2", "Q3", ...],
    "advanced": ["Q1", "Q2", "Q3", ...]
}}

DO NOT include any explanations, markdown formatting, or text outside the JSON.
    """

    response = get_ai_response(prompt)

    # Try to parse JSON safely
    try:
        questions = json.loads(response)
    except json.JSONDecodeError:
        print("⚠️ Warning: LLM response was not valid JSON. Displaying raw output below.\n")
        print(response)
        questions = {"raw": response}

    return questions


def print_questions(questions: dict):
    """
    Nicely prints the categorized questions.
    """
    print("\n=== Generated Technical Interview Questions ===\n")
    for level, qs in questions.items():
        print(f"--- {level.upper()} ---")
        if isinstance(qs, list):
            for i, q in enumerate(qs, 1):
                print(f"{i}. {q}")
        else:
            print(qs)
        print()


if __name__ == "__main__":
    print("📄 Job Description → Interview Question Generator\n")
    jd_text = input("Paste Job Description below:\n> ")

    print("\n⏳ Generating questions... please wait...\n")
    questions = generate_questions_from_jd(jd_text)
    print_questions(questions)
