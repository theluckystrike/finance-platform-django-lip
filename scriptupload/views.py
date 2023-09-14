from django.shortcuts import render
from .forms import ScriptUploadForm, NewScriptCategory, ScriptAddCategoryForm
from .utils import run_script
from django.shortcuts import get_object_or_404, redirect
from .models import Script, ScriptCategory
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
import nbformat
from nbconvert import PythonExporter
import os
from django.core.files import File

# TODO: always search up using pk


def upload_script(request):
    if request.method == "POST":
        form = ScriptUploadForm(request.POST, request.FILES)
        if form.is_valid():
            category_name = form.cleaned_data["category_name"]
            category = ScriptCategory.objects.get(name=category_name)
            file = form.cleaned_data['file']
            if file.name.endswith('.ipynb'):
                # if the file is a jupyter notebook, we need to convert it
                nb_content = nbformat.read(file, as_version=4)
                exporter = PythonExporter()
                (python_code, resources) = exporter.from_notebook_node(nb_content)
                python_file_name = file.name.replace('.ipynb', '.py')
                with open(python_file_name, 'w') as output_file:
                    output_file.write(python_code)
                # create the new file object 
                new_file = File(open(python_file_name, 'rb'))
                script = form.save(commit=False)
                # create the script instance and update file field
                script.file = new_file
                script.save()
                script.categories.add(category)
                script.save()
                # remove the temporary file
                if os.path.exists(python_file_name):
                    os.remove(python_file_name)
            else:
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
    # TODO: return only the name of scripts and categories in the context
    return render(request, "scriptupload/upload.html", {"scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})


def category_page(request, categoryname):
    category = get_object_or_404(ScriptCategory, name=categoryname)
    return render(request, "scriptupload/category.html", {"category": category, "scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})


def script_page(request, scriptname):
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        run_script(script)
    return render(request, "scriptupload/script.html", {"script": script, "scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})


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


def script_delete_category(request, scriptid, categoryid):
    if request.method == "DELETE":
        script = get_object_or_404(Script, pk=scriptid)
        category = get_object_or_404(ScriptCategory, pk=categoryid)
        script.categories.remove(category)
        # TODO: figure out why this message does not show and there are is an
        # additional DELETE request to script/  
        messages.success(request, "Script successfully removed from category")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
    return HttpResponseRedirect("/")


def script_add_category(request, scriptid):
    if request.method == "POST":
        form = ScriptAddCategoryForm(request.POST)
        if form.is_valid():
            script = get_object_or_404(Script, pk=scriptid)
            category = get_object_or_404(ScriptCategory, pk=form.cleaned_data["category_name"])
            script.categories.add(category)
            messages.success(request, f"Script successfully added to category '{category.name}'")
        else:
            messages.error(request, f"Could not add script to category '{category.name}'")
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
