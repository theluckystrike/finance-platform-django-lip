from django.shortcuts import render
from .forms import ScriptUploadForm, NewScriptCategory
from .utils import run_script
from django.shortcuts import get_object_or_404
from .models import Script, ScriptCategory
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse


def upload_script(request):
    if request.method == "POST":
        form = ScriptUploadForm(request.POST, request.FILES)

        if form.is_valid():
            category_name = form.cleaned_data["category_name"]
            category = ScriptCategory.objects.get(name=category_name)
            script = form.save(commit=False)
            script.category = category
            script.save()
            messages.success(request, "Script added successfully")
        else:
            # TODO: catch other possible issues
            messages.info(request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    return render(request, "scriptupload/upload.html", {"scripts": Script.objects.all(), "categories": ScriptCategory.objects.all()})


def script(request, scriptname):
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        run_script(script)
    return render(request, "scriptupload/script.html", {"script": script, "scripts": Script.objects.all()})


def create_category(request):
    if request.method == "POST":
        form = NewScriptCategory(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "New category added successfully")
        else:
            # TODO: catch duplicates and create message
            messages.info(request, "Category already exists")

    return HttpResponseRedirect("/")


def script_search(request):
    if request.method == "POST":
        search_query = request.POST.get("script_name")
        results = Script.objects.filter(name__icontains=search_query)
        if len(results) > 0 and len(search_query) > 0:
            data = []
            for result in results:
                r = {
                    'name': result.name,
                    'url': f"/scripts/{result.name}"
                }
                data.append(r)
        else:
            data = "No results"
        return JsonResponse({"results": data})
    return HttpResponseRedirect("/")