from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session
import models, schemas
from database import SessionLocal
from typing import List, Union

router = APIRouter(prefix="/candidates", tags=["Candidates"])

# ----------------------------------------
# Database Session Dependency
# ----------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------------------
# Create Candidate(s)
# ----------------------------------------
@router.post("/", response_model=List[schemas.CandidateResponse])
def create_candidate(
    candidates: Union[schemas.CandidateCreate, List[schemas.CandidateCreate]],
    db: Session = Depends(get_db)
):
    if not isinstance(candidates, list):
        candidates = [candidates]

    added_candidates = []

    for candidate in candidates:
        existing = db.query(models.Candidate).filter(models.Candidate.email == candidate.email).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Candidate with email {candidate.email} already exists.")

        candidate_data = candidate.dict(exclude_unset=True)

        # Default stage & status
        candidate_data.setdefault("status", schemas.StatusEnum.applied)
        candidate_data.setdefault("stage", schemas.StageEnum.screening)
        candidate_data.setdefault("contact", None)

        new_candidate = models.Candidate(**candidate_data)
        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)
        added_candidates.append(new_candidate)

    return added_candidates


# ----------------------------------------
# List All Candidates
# ----------------------------------------
@router.get("/", response_model=List[schemas.CandidateResponse])
def list_candidates(db: Session = Depends(get_db)):
    return db.query(models.Candidate).all()


# ----------------------------------------
# Update Candidate Status
# ----------------------------------------
@router.patch("/{candidate_id}/status")
def update_status(candidate_id: int, status_update: schemas.StatusUpdate, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate.status = status_update.status
    db.commit()
    db.refresh(candidate)
    return {"message": "Status updated", "candidate": candidate}


# ----------------------------------------
# Update Candidate Stage
# ----------------------------------------
@router.patch("/{candidate_id}/stage")
def update_stage(candidate_id: int, stage_update: schemas.StageUpdate, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate.stage = stage_update.stage
    db.commit()
    db.refresh(candidate)
    return {"message": "Stage updated", "candidate": candidate}


# ----------------------------------------
# Delete Candidate
# ----------------------------------------
@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    db.delete(candidate)
    db.commit()
    return {"message": "Candidate deleted successfully"}


# ----------------------------------------
# Update Candidate Information (Partial)
# ----------------------------------------
@router.patch("/{candidate_id}")
def update_candidate_info(
    candidate_id: int,
    candidate_update: schemas.CandidateCreate,
    db: Session = Depends(get_db)
):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    update_data = candidate_update.dict(exclude_unset=True)

    if "email" in update_data and update_data["email"] != candidate.email:
        existing = db.query(models.Candidate).filter(
            models.Candidate.email == update_data["email"],
            models.Candidate.id != candidate_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")

    for field, value in update_data.items():
        setattr(candidate, field, value)

    db.commit()
    db.refresh(candidate)
    return {"message": "Candidate info updated", "candidate": candidate}


# ----------------------------------------
# Import Candidates from Excel/CSV
# ----------------------------------------
@router.post("/import")
async def import_candidates(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Import multiple candidates from CSV or Excel.
    Accepts HR sheet with complex column headers and maps them to model fields.
    """
    try:
        contents = await file.read()

        # Determine file type
        if file.filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use CSV or Excel.")

        # Normalize column names (lowercase + strip)
        df.columns = [col.strip().lower() for col in df.columns]

        # ✅ Map your HR sheet columns → backend field names
        column_map = {
            "candidate's name": "name",
            "email": "email",
            "phone number (10 digit only)": "contact",
            "date of birth": "birthdate",
            "experience in years": "experience",
            "current employment status": "current_employment",
            "highest education": "highest_education",
            "graduation college name": "graduation_college",
            "graduation percentage": "graduation_percentage",
            "post-graduation college name": "post_graduation_college",
            "post-graduation percentage": "post_graduation_percentage",
            "most recent employer": "employer",
            "key skills": "skills",
            "technical certification(mention if any)": "certification",
            "upload a resume": "resume_link",
            "location": "location",
            "current ctc": "current_ctc",
            "expected ctc": "expected_ctc",
            "notice period": "notice_period",
            "work mode": "work_mode"
        }

        # Rename columns if they exist
        df = df.rename(columns={k: v for k, v in column_map.items() if k in df.columns})

        # ✅ Now check we have at least name + email
        required_cols = {"name", "email"}
        if not required_cols.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"Missing required columns: {required_cols}")

        added, skipped = 0, 0

        for _, row in df.iterrows():
            name = row.get("name")
            email = row.get("email")
            if pd.isna(name) or pd.isna(email):
                continue

            existing = db.query(models.Candidate).filter(models.Candidate.email == email).first()
            if existing:
                skipped += 1
                continue

            new_candidate = models.Candidate(
                name=name,
                email=email,
                contact=row.get("contact"),
                birthdate=row.get("birthdate"),
                experience=row.get("experience"),
                current_employment=row.get("current_employment"),
                highest_education=row.get("highest_education"),
                graduation_college=row.get("graduation_college"),
                graduation_percentage=row.get("graduation_percentage"),
                post_graduation_college=row.get("post_graduation_college"),
                post_graduation_percentage=row.get("post_graduation_percentage"),
                employer=row.get("employer"),
                skills=row.get("skills"),
                certification=row.get("certification"),
                resume_link=row.get("resume_link"),
                location=row.get("location"),
                current_ctc=row.get("current_ctc"),
                expected_ctc=row.get("expected_ctc"),
                notice_period=row.get("notice_period"),
                work_mode=row.get("work_mode"),
                status=models.StatusEnum.applied,
                stage=models.StageEnum.screening
            )

            db.add(new_candidate)
            added += 1

        db.commit()
        return {"message": f"Imported {added} candidates successfully", "added": added, "skipped": skipped}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

