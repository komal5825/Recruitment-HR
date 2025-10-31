from sqlalchemy import Column, Integer, String, Enum, Date , Float
from database import Base
import enum

# -------------------------------
# ENUMS (same as schemas)
# -------------------------------

class StatusEnum(str, enum.Enum):
    applied = "Applied"
    shortlisted = "Shortlisted"
    selected = "Selected"
    rejected = "Rejected"
    on_hold = "On Hold"

class StageEnum(str, enum.Enum):
    screening = "Screening"
    l1 = "L1 Evaluation"
    l2 = "L2 Evaluation"
    hr = "HR Round"
    onboarding = "Onboarding"

# -------------------------------
# MAIN MODEL (Database Table)
# -------------------------------

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    contact = Column(String(20))
    birthdate = Column(String(20))
    experience = Column(String(50))
    current_employment = Column(String(100))
    highest_education = Column(String(100))
    graduation_college = Column(String(255))
    graduation_percentage = Column(String(10))
    post_graduation_college = Column(String(255))
    post_graduation_percentage = Column(String(10))
    employer = Column(String(255))
    skills = Column(String(255))
    certification = Column(String(255))
    resume_link = Column(String(255))
    location = Column(String(100))
    current_ctc = Column(String(50))
    expected_ctc = Column(String(50))
    notice_period = Column(String(50))
    work_mode = Column(String(50))
    status = Column(Enum(StatusEnum), default=StatusEnum.applied)
    stage = Column(Enum(StageEnum), default=StageEnum.screening)

    def __repr__(self):
        return f"<Candidate(name={self.name}, email={self.email}, status={self.status}, stage={self.stage})>"
