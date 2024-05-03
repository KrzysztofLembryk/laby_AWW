from django.shortcuts import render
from django.conf import settings
import os
from .models import SVG_image
from django.contrib.auth.decorators import login_required
import re
import xml.etree.ElementTree as ET
from django.shortcuts import redirect
from django.core.paginator import Paginator
from taggit.models import Tag

ET.register_namespace('',"http://www.w3.org/2000/svg")

# Create your views here.
@login_required
def index(request):
    return render(request, 'obrazkiApp/index.html')

def svg_detail(request, svg_id):
    # trzeba bedzie zmienic na get_object_or_404
    svg_object = SVG_image.objects.get(id=svg_id)

    return render(request, 'obrazkiApp/svg_detail.html', {'svg_object': svg_object})

def make_svg_thumbnails(svg_objects):
    for svg_object in svg_objects:

        main_svg_file_path = settings.STATIC_ROOT / "svg" / (svg_object.name + ".svg")
        resized_file = ""

        if os.path.exists(main_svg_file_path):
            with open(main_svg_file_path, 'r') as file:
                file_content = file.read()
                svg_header_end_idx = file_content.find('>')
                new_header = f'<svg width="{40}" height="{40}"  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
                resized_file = new_header + file_content[svg_header_end_idx + 1:]

        thumbnail_path = settings.STATIC_ROOT / "svg" / (svg_object.name + "_thumb.svg")
        with open(thumbnail_path, "w") as file:
            file.write(resized_file)

def make_svgobject_thumbnail_double_list(svg_objects):
    thumbnails_lst = []
    for svg in svg_objects:
        thumbnails_lst.append(settings.STATIC_ROOT / "svg" / (svg.name + "_thumb"))
    double_lst = list(zip(svg_objects, thumbnails_lst))
    return double_lst

def list_svg_images(request):

    tag = request.GET.get("tag")
    if (tag):
        svg_objects = SVG_image.objects.filter(tags__name__in=[tag])
    else:
        svg_objects = SVG_image.objects.all()

    double_lst = make_svgobject_thumbnail_double_list(svg_objects)
    make_svg_thumbnails(svg_objects)
    pagin = Paginator(double_lst, 2)
    page_number = request.GET.get('page')
    images = pagin.get_page(page_number)
    tags = Tag.objects.all()

    return render(request, 'obrazkiApp/list_svg_images.html', {"images": images, "tags": tags})

@login_required
def svg_form_view(request):
    if request.method == 'POST':
        name = request.POST["name"]
        x = request.POST["x"]
        y = request.POST["y"]
        height = request.POST["height"]
        width = request.POST["width"]
        color = request.POST["color"]

        svg_image = f'<svg height="100" width="100" viewBox="0 0 100 100" ' + 'version="1.1" xmlns="http://www.w3.org/2000/svg">' + f'<rect x="{x}" y="{y}" width="{width}" height="{height}"' + f' fill="{color}"/>' + '</svg>' 

        file_path = os.path.join(settings.MEDIA_ROOT, f'images/{name}.svg')
        with open(file_path, 'w') as file:
            file.write(svg_image)

        return render(request, 'obrazkiApp/svg_img_form.html', {'svg_image_name': name})
    else:
        return render(request, 'obrazkiApp/svg_img_form.html', {})

@login_required
def svg_modifiable_list(request):
    svg_objects = SVG_image.objects.all()
    modifiable_lst = []

    for svg in svg_objects:
        if svg.permitted_users.filter(id=request.user.id):
            modifiable_lst.append(svg)

    make_svg_thumbnails(modifiable_lst)    
    svgobj_thumb_lst = make_svgobject_thumbnail_double_list(modifiable_lst)

    pagin = Paginator(svgobj_thumb_lst, 2)
    page_number = request.GET.get('page')
    images = pagin.get_page(page_number)

    return render(request, 'obrazkiApp/svg_modifiable_list.html', {'images': images})


def add_new_rect(request, file_path):
    x = request.POST["x"]
    y = request.POST["y"]
    height = request.POST["height"]
    width = request.POST["width"]
    color = request.POST["color"]

    if os.path.exists(file_path):
        without_end = ""

        with open(file_path, 'r') as file:
            # otwieramy plik svg i czytamy cala zawartosc, nastepnie    
            # zapamietujemy calosc poza koncem i dodajemy na koniec nowy rect
            file_content = file.read()
            without_end = file_content[:file_content.find('</svg>')]

        new_rect = f'<rect x="{x}" y="{y}" width="{width}" height="{height}" fill="{color}"/>\n'
        new_content = without_end + new_rect + '</svg>'

        with open(file_path, 'w') as file:
            file.write(new_content)

def get_rect_lst(file_path):
    if os.path.exists(file_path):
        file_content = ""
        rect_list = []
        with open(file_path, 'r') as file:
            # otwieramy plik svg i czytamy cala zawartosc, nastepnie    
            # zapamietujemy naglowek svg i oddzielamy obiekty rect 
            file_content = file.read()
            root = ET.fromstring(file_content)
            rect_list = []
            for child in root:
                rect_list.append(child)
        return rect_list

@login_required
def svg_modifiable_detail(request, svg_id):
    svg_object = SVG_image.objects.get(id=svg_id)
    file_path = settings.STATIC_ROOT / "svg" / (svg_object.name + ".svg")

    if request.method == 'POST':
        add_new_rect(request, file_path)

    rect_list = get_rect_lst(file_path)

    return render(request, 'obrazkiApp/svg_modifiable_detail.html', {'svg_object': svg_object, 'rect_list': rect_list})

def remove_rect_helper(file_path, rect_id):
    if os.path.exists(file_path):
        final_file = ""
        with open(file_path, 'r') as file:
            file_content = file.read()
            root = ET.fromstring(file_content)
            rect_list = []

            for child in root:
                rect_list.append(child)

            i = 0
            final_file = file_content[:file_content.find('>') + 1] + "\n"

            for rect in rect_list:
                if i != rect_id:
                    new_rect = f'<rect x="{rect.attrib['x']}" y="{rect.attrib['y']}" width="{rect.attrib['width']}" height="{rect.attrib['height']}" fill="{rect.attrib['fill']}"/>\n'
                    final_file += new_rect
                i += 1 
            final_file += '</svg>'

        with open(file_path, 'w') as file:
            file.write(final_file)

@login_required
def svg_remove_rect(request, svg_id, rect_id):
    svg_object = SVG_image.objects.get(id=svg_id)
    file_path = settings.STATIC_ROOT / "svg" / (svg_object.name + ".svg")

    remove_rect_helper(file_path, rect_id)

    return redirect('obrazkiApp:svg_modifiable_detail', svg_id=svg_id)