from django.shortcuts import render
from .forms import ScriptUploadForm, NewScriptCategory, ScriptAddCategoryForm
from .utils import run_script
from django.shortcuts import get_object_or_404, redirect
from .models import Script, ScriptCategory
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse

# TODO: always search up using pk


def upload_script(request):
    if request.method == "POST":
        form = ScriptUploadForm(request.POST, request.FILES)
        if form.is_valid():
            category_name = form.cleaned_data["category_name"]
            category = ScriptCategory.objects.get(name=category_name)
            script = form.save(commit=False)
            script.save()
            script.categories.add(category)
            script.save()
            messages.success(request, "Script added successfully")
        else:
            # TODO: catch other possible issues
            messages.info(request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    return render(request, "scriptupload/upload.html", {"scripts": Script.objects.all(), "categories": ScriptCategory.objects.all()})


def script_page(request, scriptname):
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        run_script(script)
    return render(request, "scriptupload/script.html", {"script": script, "scripts": Script.objects.all(), "categories": ScriptCategory.objects.all()})


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


def script_delete_category(request, scriptid, categoryname):
    if request.method == "DELETE":
        script = get_object_or_404(Script, id=scriptid)
        category = get_object_or_404(ScriptCategory, name=categoryname)
        script.categories.remove(category)
        messages.success(request, "Script removed from category successfully")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
    return HttpResponseRedirect("/")


def script_add_category(request, scriptid):
    if request.method == "POST":
        form = ScriptAddCategoryForm(request.POST)
        if form.is_valid():
            script = get_object_or_404(Script, pk=scriptid)
            category = get_object_or_404(ScriptCategory, pk=form.cleaned_data["category_name"])
            script.categories.add(category)
            messages.success(request, "Script added to category successfully")
        else:
            messages.error(request, "Could not add script to category")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
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
