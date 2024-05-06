from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DJANGO_APP_DIR = '../5lab_django_intro/my_site/db.sqlite3'

DATABASE_URL = "sqlite:///" + DJANGO_APP_DIR

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()