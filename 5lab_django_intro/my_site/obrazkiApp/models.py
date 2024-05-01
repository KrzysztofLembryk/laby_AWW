from typing import Any
from django.db import models
from django.db import models
from django.contrib.auth.models import User
import os
from pathlib import Path

# Create your models here.
class SVG_image(models.Model):
    name = models.CharField(max_length=100)
    width = models.PositiveIntegerField()
    height = models.PositiveIntegerField()
    permitted_users = models.ManyToManyField(User)
    # svg = models.FileField(upload_to="images/")

    def __str__(self):
        return self.name
    
    def create_svg(self):
        svg_content = f'<svg width="100" height="100"><rect width="{self.width}" height="{self.height}" /></svg>'
        base_dir = Path(__file__).resolve().parent.parent
        file_path = base_dir / "media/images/" / (self.name + ".svg")

        with open(file_path, 'w') as file:
            file.write(svg_content)

    def save(self, *args, **kwargs):
        # Using the regular field, set the value of the read-only field.
        self.create_svg()
        # call the parent's save() method
        super(SVG_image, self).save(*args, **kwargs)
    #     # return f'<svg width=100" height=100"><rect width="{self.width}" height="{self.height}" /></svg>'