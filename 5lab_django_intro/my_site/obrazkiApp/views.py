from django.shortcuts import render
from django.conf import settings
import os

# Create your views here.
def index(request):
    return render(request, 'obrazkiApp/index.html')

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


