from django.shortcuts import render
from django.conf import settings
import os
from .models import SVG_image
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def index(request):
    return render(request, 'obrazkiApp/index.html')

def svg_detail(request, svg_id):
    # trzeba bedzie zmienic na get_object_or_404
    svg_object = SVG_image.objects.get(id=svg_id)
    return render(request, 'obrazkiApp/svg_detail.html', {'svg_object': svg_object})

def list_svg_images(request):
    svg_objects = SVG_image.objects.all()
    return render(request, 'obrazkiApp/list_svg_images.html', {'svg_objects': svg_objects})

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


