from django.shortcuts import render
from .forms import ScriptUploadForm
from .utils import run_script
from django.shortcuts import get_object_or_404
from .models import Script
from django.contrib import messages


def index(request):
    if request.method == "POST":
        script_data = {
            "name": request.FILES['file'].name.replace('.py', ''),
        }
        form = ScriptUploadForm(script_data, request.FILES)
        if form.is_valid():
            # handle_script_upload(request.FILES["file"])
            # run_script(request.FILES["file"].name)
            form.save()
            messages.success(request, "Script added successfully")
        else:
            messages.info(request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    return render(request, "scriptupload/index.html", {"form": form, "scripts": Script.objects.all()})


def script(request, scriptname):
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        run_script(script)
    return render(request, "scriptupload/script.html", {"script": script, "scripts": Script.objects.all()})