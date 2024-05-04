from django.core.management.base import BaseCommand, CommandError
from obrazkiApp.models import SVG_image
import string
import random
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import os
from datetime import datetime
from django.utils import timezone

def svg_name_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def add_new_rect(file_path, width, height):

    if os.path.exists(file_path):
        without_end = ""

        with open(file_path, 'r') as file:
            file_content = file.read()
            without_end = file_content[:file_content.find('</svg>')]

    low = 4
    i = random.randint(2, 6)
    for k in range(i):
        x = random.randint(low, width //2 )
        y = random.randint(low, height // 2)
        rect_height = random.randint(low, max(height - y, low + 1))
        rect_width = random.randint(low, max(width - x, low + 1))
        color = "#"+''.join([random.choice('0123456789ABCDEF') for j in range(6)])
        new_rect = f'<rect x="{x}" y="{y}" width="{rect_width}" height="{rect_height}" fill="{color}"/>\n'
        without_end = without_end + new_rect 

    new_content = without_end + '</svg>'
    with open(file_path, 'w') as file:
        file.write(new_content)


class Command(BaseCommand):
    help = 'Adds random SVG images to the database, specify width and height >= 10'

    def add_arguments(self, parser):
        parser.add_argument("width", nargs="+", type=int)
        parser.add_argument("height", nargs="+", type=int)

    def handle(self, *args, **options):
        width = options["width"][0]
        height = options["height"][0]

        if width < 10:
            width = 10
        if height < 10:
            height = 10

        pub_date=models.DateTimeField(auto_now_add=True)
        permitted_users= User.objects.get(username="admin")
        name = svg_name_generator()
        name = "svg_" + name
        new_obj = SVG_image.objects.create(name=name, 
                                        width=width, 
                                        height=height,
                                        pub_date=timezone.now())
        new_obj.tags.add("random")
        new_obj.permitted_users.add(permitted_users)
        new_obj.save()

        file_path = settings.STATIC_ROOT / "svg" / (name + ".svg")
        add_new_rect(file_path, width, height)
        
        self.stdout.write(self.style.SUCCESS(f"Added SVG image with width: {width} and height: {height}, name: {name}"))
