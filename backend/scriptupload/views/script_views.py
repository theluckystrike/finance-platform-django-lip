# this is start apis import modules
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django_rq import get_queue
from rest_framework.parsers import MultiPartParser, FormParser
from ..serializers import  ScriptSerializer
# this is end  apis import modules




import csv
import django_rq
from django.utils import timezone
from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.base import ContentFile
from django.utils.safestring import mark_safe
from ..forms import ScriptUploadForm
from ..utils.utils import handover_script
from ..models import Script, Category
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
import nbformat
from nbconvert import PythonExporter
from django.template.defaulttags import register
import os
from django.core.files import File
from django.contrib.auth.decorators import login_required
from ..tables import ScriptTable, create_dynamic_csv_table
import logging
from django_tables2 import RequestConfig


logger = logging.getLogger('testlogger')
execution_states = Script.ExecutionStatus
output_types = Script.OutputDataType

# start web functios of the script sections

@login_required
def upload_script(request):
    """
    Configures the page that shows when "Upload a script" is clicked in the sidebar.
    """
    if request.method == "POST":
        form = ScriptUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.cleaned_data['file']
            script = form.save(commit=False)
            if (not file.name.endswith(".py")) and (not file.name.endswith(".ipynb")):
                messages.error(request, mark_safe(
                    "<u>Not a valid Python file</u>:<br/>File must be .py or .ipynb"))
                return render(request, "bootstrap/script/upload.html", {"categories": Category.objects.filter(parent_category=None)})

            if file.name.endswith('.ipynb'):
                # if the file is a jupyter notebook, we need to convert it
                nb_content = nbformat.read(file, as_version=4)
                exporter = PythonExporter()
                (python_code, resources) = exporter.from_notebook_node(nb_content)
                python_file_name = file.name.replace('.ipynb', '.py')
                # TODO: use a buffer here
                with open(python_file_name, 'w') as output_file:
                    output_file.write(python_code)
                # create the new file object
                new_file = File(open(python_file_name, 'rb'))
                # create the script instance and update file field
                script.file = new_file
                # remove the temporary file
                if os.path.exists(python_file_name):
                    os.remove(python_file_name)
            script.added_by = request.user
            script.save()
            logger.info(
                f"[script upload view] Uploaded script * {script.name} *")
            messages.success(request, "Script added successfully")
        else:
            messages.info(
                request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    return render(request, "bootstrap/script/upload.html", {'output_types': output_types, "categories": Category.objects.filter(parent_category=None)})


@login_required
def all_script_page(request):
    """
    Configures the page that is shown when "All scripts" is clicked in the sidebar.
    """
    scripttable = ScriptTable(Script.objects.all())
    RequestConfig(request).configure(scripttable)
    # category = get_object_or_404(Category, name=categoryname)
    return render(request, "bootstrap/script/all_scripts.html", {"scripts": Script.objects.all(), "script_table": scripttable, "categories": Category.objects.filter(parent_category=None)})


@login_required
def script_page(request, scriptname):
    """
    Configures the page that shows an individual script when it is clicked on.
    """
    # TODO: change these to use pk
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        nameform = ScriptUploadForm(request.POST, instance=script)

        if nameform.is_valid():
            nameform.save()
        return redirect(script_page, nameform.cleaned_data['name'])
    else:
        nameform = ScriptUploadForm(instance=script)
        nameform.fields['file'].required = False
        nameform.fields['output_type'].required = False
    if script.has_table_data:
        # TODO this should be on the script model
        with script.table_data_file.open('r') as csvfile:
            reader = csv.DictReader(csvfile)
            data = list(reader)
            headers = reader.fieldnames

        table = create_dynamic_csv_table(headers, data)
        RequestConfig(request).configure(table)
    else:
        table = None
    return render(request, "bootstrap/script/script.html", {'nameform': nameform, "script_table": table, "script": script, "categories": Category.objects.filter(parent_category=None)})


@login_required
def run_script_code(request, scriptname):
    """
    Configures the "Run" button that shows when looking at a script and the page that is shown when clicked.
    """
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        script.set_status(execution_states.RUNNING)
        django_rq.get_queue("scripts").enqueue(
            handover_script, request.user, script)
        logger.info(
            f"[task queue] Added script * {script.name} * by user * {request.user.username} * to task queue")
    return redirect(script_page, scriptname)


@login_required
def get_script_status(request, scriptid):
    script = get_object_or_404(Script, pk=scriptid)
    if request.method == "GET":
        script_status = script.status
        if script_status != execution_states.FAILURE:
            return JsonResponse({"status": script.get_status_display()})
        else:
            return JsonResponse({"status": script.get_status_display(), "error_message": script.error_message})


@login_required
def delete_script(request, scriptname):
    """
    Configures the "Delete" button that shows when looking at a script and the page that is shown when clicked.
    """
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        script.delete()
    return redirect(upload_script)


@login_required
def script_edit_page(request, scriptname):
    """
    Configures the "Edit" button that shows when looking at a script and the page that is shown when clicked.
    """
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "GET":
        file_contents = script.file.read().decode("utf-8")
        return render(request, "bootstrap/script/script_edit.html", {'file_contents': file_contents, "script": script, "categories": Category.objects.filter(parent_category=None)})
    elif request.method == "POST":
        # Get the edited script content and description from request
        script_code = script.file.read().decode("utf-8")
        edited_content = request.POST.get(
            'edited_content', script_code)
        edited_description = request.POST.get('description', script.description)
        if edited_content != script_code:
            # encode and save to file
            script.file.save(os.path.basename(script.file.name),
                             ContentFile(edited_content.encode("utf-8")))
            logger.info(f'[script edit page] Successfully updated code for script * {script.name} *')
        if edited_description != script.description:
            script.description = edited_description
            logger.info(f'[script edit page] Successfully updated description for script * {script.name} *')
            # script.last_updated = timezone.now()
            script.save(update_fields=["description"])
        messages.success(request, "Script updated successfully")
        return redirect(script_page, script.name)


@login_required
def change_script_category_index(request, pk):
    if request.method == "POST":
        new_index = request.POST.get("new-index")
        script = get_object_or_404(Script, pk=pk)
        script.update_index(int(new_index))
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)


@login_required
def script_search(request):
    """
    Configures the functionality to search for a specific script.
    """
    if request.method == "POST":
        search_query = request.POST.get("script_name")
        results = Script.objects.filter(name__icontains=search_query)
        if len(results) > 0 and len(search_query) > 0:
            data = []
            for result in results:
                r = {
                    'name': result.name,
                    'url': f"/scripts/view/{result.name}",
                    'category': result.category.name if result.category else "",
                    'parent_category': result.category.parent_category.name if result.category else '',
                    'super_category': result.category.parent_category.parent_category.name if result.category else ''

                }
                data.append(r)
        else:
            data = "No results"
        return JsonResponse({"results": data})
    return HttpResponseRedirect("/")


@register.filter
def output_type_name(script):
    return script.get_output_type_display()
# end web functios of the script sections


# start RestFull design apis of the script sections

class UploadScriptView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = ScriptSerializer(data=request.data)
        if serializer.is_valid():
            # Access validated data
            validated_data = serializer.validated_data

            # Create the script instance without saving
            script = Script(
                name=validated_data.get('name'),
                category=validated_data.get('category'),
                output_type=validated_data.get('output_type'),
                description=validated_data.get('description'),
                added_by=request.user  # Set the user who uploaded the script
            )

            # Handle file separately
            file = request.FILES.get('file')

            if not file.name.endswith((".py", ".ipynb")):
                return Response({"error": "File must be .py or .ipynb"}, status=status.HTTP_400_BAD_REQUEST)

            if file.name.endswith('.ipynb'):
                # Convert notebook (.ipynb) to Python file
                nb_content = nbformat.read(file, as_version=4)
                exporter = PythonExporter()
                python_code, _ = exporter.from_notebook_node(nb_content)
                python_file_name = file.name.replace('.ipynb', '.py')
                with open(python_file_name, 'w') as output_file:
                    output_file.write(python_code)
                new_file = File(open(python_file_name, 'rb'))
                script.file = new_file

                # Clean up the temporary Python file
                if os.path.exists(python_file_name):
                    os.remove(python_file_name)
            else:
                script.file = file  # If it's a .py file, use it directly

            # Now save the script
            script.save()

            logger.info(f"[script upload view] Uploaded script * {script.name} *")

            return Response({"success": "Script added successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""class ScriptListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScriptSerializer

    def get_queryset(self):
        return Script.objects.all()

    def get(self, request, *args, **kwargs):
        scripts = self.get_queryset()
        serializer = self.get_serializer(scripts, many=True)
        # Convert the script data to table format if necessary
        scripttable = ScriptTable(scripts)
        RequestConfig(request).configure(scripttable)
        # Pass the request object to the as_html() method
        script_table_html = scripttable.as_html(request)
        return Response({"scripts": serializer.data})
"""

class ScriptListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScriptSerializer

    def get_queryset(self):
        return Script.objects.all()

    def get(self, request, *args, **kwargs):
        # Retrieve all script objects
        scripts = self.get_queryset()

        # Serialize the script data
        serializer = self.get_serializer(scripts, many=True)

        # Get all categories
        categories = Category.objects.filter(parent_category=None)
        category_data = [{"id": cat.id, "name": cat.name} for cat in categories]

        # Prepare and return the JSON response
        return Response({
            "scripts": serializer.data,        # Serialized script data
            "categories": category_data        # Serialized category data
        })



class ScriptDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScriptSerializer
    queryset = Script.objects.all()
    lookup_field = 'name'

    def get(self, request, *args, **kwargs):
        script = get_object_or_404(Script, name=kwargs['name'])
        serializer = self.get_serializer(script)
        file_contents = script.file.read().decode("utf-8") if script.file else ""
        data = serializer.data
        data.update({"file_contents": file_contents})
        return Response(data)


"""class RunScriptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        script = get_object_or_404(Script, name=kwargs['name'])
        script.set_status(execution_states.RUNNING)
        django_rq.get_queue("scripts").enqueue(handover_script, request.user, script)
        logger.info(f"[task queue] Added script * {script.name} * by user * {request.user.username} * to task queue")
        return Response({"status": "Script is running" , "script_name": script.name , "Script all data":script}, status=status.HTTP_202_ACCEPTED)
"""

class RunScriptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Fetch the script by name
        script = get_object_or_404(Script, name=kwargs['name'])

        # Set the status of the script to 'RUNNING'
        script.set_status(execution_states.RUNNING)

        # Enqueue the script to the task queue
        django_rq.get_queue("scripts").enqueue(handover_script, request.user, script)

        # Log the script action
        logger.info(f"[task queue] Added script * {script.name} * by user * {request.user.username} * to task queue")

        # Serialize the script data
        script_serializer = ScriptSerializer(script)

        # Return the script's status, name, and all serialized data
        return Response({
            "status": "Script is running",
            "script_name": script.name,
            "script_all_data": script_serializer.data  # Include all script data using the serializer
        }, status=status.HTTP_202_ACCEPTED)


class ScriptStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        script = get_object_or_404(Script, pk=kwargs['scriptid'])
        status = script.status
        response_data = {"status": script.get_status_display()}
        if status == execution_states.FAILURE:
            response_data["error_message"] = script.error_message
        return Response(response_data, status=status.HTTP_200_OK)


class DeleteScriptView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        script = get_object_or_404(Script, name=kwargs['name'])
        script.delete()
        return Response({"status": "Script deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class EditScriptView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, *args, **kwargs):
        script = get_object_or_404(Script, name=kwargs['name'])
        form = ScriptUploadForm(request.data, files=request.FILES, instance=script)
        if form.is_valid():
            form.save()
            return Response({"status": "Script updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Form is invalid"}, status=status.HTTP_400_BAD_REQUEST)

class ChangeScriptCategoryIndexView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        new_index = request.data.get("new_index")
        script = get_object_or_404(Script, pk=kwargs['pk'])
        script.update_index(int(new_index))
        return Response({"status": "success"}, status=status.HTTP_200_OK)

class ScriptSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        search_query = request.data.get("script_name", "")
        results = Script.objects.filter(name__icontains=search_query)
        data = [
            {
                'name': result.name,
                'url': f"/scripts/view/{result.name}",
                'category': result.category.name if result.category else "",
                'parent_category': result.category.parent_category.name if result.category else '',
                'super_category': result.category.parent_category.parent_category.name if result.category else ''
            } for result in results
        ] if results and search_query else "No results"
        return Response({"results": data}, status=status.HTTP_200_OK)


# start RestFull design  of the script sections