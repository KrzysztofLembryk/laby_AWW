from sqlalchemy.orm import Session
from . import models

def add_svg_img_to_db(db: Session, svg_image: models.SvgImage):
    db.add(svg_image)
    db.commit()
    db.refresh(svg_image)
    return svg_image