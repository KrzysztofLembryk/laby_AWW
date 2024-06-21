from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class SvgImage(Base):
    __tablename__ = "svg_images"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    width = Column(Integer)
    height = Column(Integer)
    svg = Column(String)
