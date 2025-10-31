from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from enum import Enum

# -------------------------------
# ENUM CLASSES (for dropdown / fixed values)
# -------------------------------

class StatusEnum(str, Enum):
    applied = "Applied"
    shortlisted = "Shortlisted"
    selected = "Selected"
    rejected = "Rejected"
    on_hold = "On Hold"


class StageEnum(str, Enum):
    screening = "Screening"
    l1 = "L1 Evaluation"
    l2 = "L2 Evaluation"
    hr = "HR Round"
    onboarding = "Onboarding"


# -------------------------------
# BASE SCHEMA
# -------------------------------

class CandidateBase(BaseModel):
    # --- Basic details ---
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    contact: Optional[str] = None

    # --- Personal & Professional Info ---
    birthdate: Optional[str] = None
    experience: Optional[str] = None
    current_employment: Optional[str] = None
    highest_education: Optional[str] = None
    graduation_college: Optional[str] = None
    graduation_percentage: Optional[str] = None
    post_graduation_college: Optional[str] = None
    post_graduation_percentage: Optional[str] = None
    employer: Optional[str] = None
    skills: Optional[str] = None
    certification: Optional[str] = None
    resume_link: Optional[str] = None
    location: Optional[str] = None
    current_ctc: Optional[str] = None
    expected_ctc: Optional[str] = None
    notice_period: Optional[str] = None
    work_mode: Optional[str] = None

    # --- Workflow tracking ---
    status: Optional[StatusEnum] = None
    stage: Optional[StageEnum] = None

    # --- Validators ---
    @field_validator("contact")
    def validate_contact(cls, v):
        if not v:
            return v
        v = v.replace(" ", "").replace("-", "")
        if v.startswith("+"):
            num = v[1:]
        else:
            num = v
        if not num.isdigit():
            raise ValueError("Contact number must contain only digits (and optional leading '+').")
        if len(num) < 10 or len(num) > 15:
            raise ValueError("Contact number must be between 10 and 15 digits long.")
        return v


# -------------------------------
# SCHEMAS FOR REQUESTS
# -------------------------------

class CandidateCreate(CandidateBase):
    """Used when creating or importing a new candidate"""
    pass


class StatusUpdate(BaseModel):
    status: StatusEnum


class StageUpdate(BaseModel):
    stage: StageEnum


# -------------------------------
# SCHEMA FOR RESPONSE
# -------------------------------

class CandidateResponse(CandidateBase):
    id: int

    class Config:
        orm_mode = True
