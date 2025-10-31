from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "sqlite:///./hr_pipeline.db" #The data is being saved in a SQLite file called hr_pipeline.db
#Everything you POST (add candidates) or PATCH (update) is stored there permanently until you delete or reset the file

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
