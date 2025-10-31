from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routes import candidates, resume_parser

# Create DB tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(title="HR Recruitment Pipeline")

# --- CORS Configuration ---
origins = ["*"]  # Allows all origins during development

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------

# Include all routers
app.include_router(candidates.router)
app.include_router(resume_parser.router)

@app.get("/")
def home():
    return {"message": "✅ HR Recruitment Pipeline API is running successfully!"}
