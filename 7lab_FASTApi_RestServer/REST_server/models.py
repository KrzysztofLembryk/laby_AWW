from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    image_path = Column(String, index=True)
    tags = Column(String, index=True)