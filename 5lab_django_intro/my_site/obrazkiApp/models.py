from typing import Any
from django.db import models
from django.db import models
from django.contrib.auth.models import User
import os
from pathlib import Path
from django.conf import settings
from taggit.managers import TaggableManager

# Create your models here.
class SVG_image(models.Model):
    name = models.CharField(max_length=100, unique=True)
    width = models.PositiveIntegerField()
    height = models.PositiveIntegerField()
    description = models.CharField(max_length=200, blank=True)
    pub_date = models.DateTimeField()
    tags = TaggableManager()
    permitted_users = models.ManyToManyField(User)

    def __str__(self):
        return self.name
    
    def create_svg(self):

        svg_header = f'<svg width="{self.width}" height="{self.height}"  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n'
        svg_end = '</svg>' 
        svg_content = svg_header + svg_end

        file_path = settings.STATIC_ROOT / "svg" / (self.name + ".svg")

        if os.path.exists(file_path):
            file_content = ""
            with open(file_path, 'r') as file:
                # otwieramy plik svg i czytamy cala zawartosc, nastepnie usuwamy
                # naglowek svg i dodajemy nasz nowy naglowek
                file_content = file.read()
                svg_header_end_idx = file_content.find('>')
                file_content = file_content[svg_header_end_idx + 1:]
                file_content = svg_header + file_content
            with open(file_path, 'w') as file:
                file.write(file_content)
        else:
            with open(file_path, 'w') as file:
                file.write(svg_content)

    def save(self, *args, **kwargs):
        self.create_svg()
        # call the parent's save() method
        super(SVG_image, self).save(*args, **kwargs)
    
    def delete(self):
        file_path = settings.STATIC_ROOT / "svg" / (self.name + ".svg")

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(e)

        file_path_thumb = settings.STATIC_ROOT / "svg" / (self.name + "_thumb.svg")
        if os.path.exists(file_path_thumb):
            try:
                os.remove(file_path_thumb)
            except Exception as e:
                print(e)

        super(SVG_image, self).delete()