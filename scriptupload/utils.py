"""
Configures utility (helper) functions to be used in other places in the project.
"""

import os
from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files import File
from django.http import HttpResponse
from django.core.files.storage import default_storage
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import shutil
from datetime import datetime
from io import BytesIO
import ast
import pkgutil
import subprocess
import traceback


def scripts_to_pdf(scripts, categoryname=None):
    """
    Converts a report that was generated to a PDF file.

    :param category: The category that the report was generated for.
    :return: The PDF file.
    """
    # get storage
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    # get urls of each script image
    for script in scripts:
        if not script.image:
            run_script(script)
    image_paths = [
        storage.url(script.image.name) for script in scripts
        if script.image.name != "" and script.image is not None
    ]
    if len(image_paths) == 0:
        return None
    # open a buffer so that files are saves to temporary memory
    buffer = BytesIO()
    # set the title of the pdf
    if categoryname:
        title_text = f"{categoryname} report"
    else:
        title_text = "Custom report"
    c = canvas.Canvas(buffer, pagesize=A4)
    c.setFont("Helvetica-Bold", 18)
    title_width = c.stringWidth(title_text, "Helvetica-Bold", 18)
    page_width, page_height = A4
    x = (page_width - title_width) / 2
    y = page_height - 50
    c.drawString(x, y, title_text)

    # add the images to the pdf
    x, y = 50, 500
    for i in range(len(image_paths)):
        if i % 2 == 0 and i != 0:
            y = 500
            c.showPage()
        c.drawImage(image_paths[i], x, y, width=500, height=250)
        y -= 300
    # save to buffer
    c.save()
    # reset the buffer position
    buffer.seek(0)
    # create response for downloading file
    response = HttpResponse(buffer.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="{}_report_{}.pdf"'.format(
        categoryname if categoryname else "CustomReport", datetime.now().strftime("%d_%m_%Y_%H_%M")
    )
    # close buffer and return http response
    buffer.close()
    return response


# not used
def handle_script_upload(file):
    print("file recieved", file.name)
    path = f"scripts/{file.name.replace('.py', '')}/{file.name}"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)


# run the script assuming that it saves the chart image as output
def run_script(file):
    """
    Runs a script and saves the result back to storage, deleting the previous version.

    :param file: The file that contains the script to be run.
    :return: None.
    """
    # find the script
    script_dir = os.path.dirname(file.file.name)
    # unique local temporary directory
    local_dir = script_dir + str(datetime.now()).replace(" ", "")
    os.makedirs(local_dir, exist_ok=True)
    # chose appropriate storage and open file
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    script = storage.open(file.file.name)
    # move to script directory and execute
    os.chdir(local_dir)
    try:
        subprocess.run(["python", "-c", script.read()], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    except subprocess.CalledProcessError as e:
        return e.stderr
    img = [f for f in os.listdir() if f.endswith('.png')]
    if len(img) > 0:
        # if the script has already saved an image
        i = open(img[-1], 'rb')
        # delete last image if it exists
        if storage.exists(os.path.join(script_dir, img[-1])):
            storage.delete(os.path.join(script_dir, img[-1]))
        # save new image
        storage.save(os.path.join(script_dir, img[-1]), File(i))
        file.image = os.path.join(script_dir, img[-1])
        file.save(update_fields=["image"])
        i.close()
    script.close()
    os.chdir(settings.BASE_DIR)
    # delete local directory that was made
    if os.path.exists(local_dir):
        shutil.rmtree(local_dir)
    return True

 
# utililty methods for finding dependencies on scripts that are not
# not installed on the server
def extract_imports(script_text):
    tree = ast.parse(script_text)
    imports = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for name in node.names:
                imports.append(name.name)
        elif isinstance(node, ast.ImportFrom):
            module = node.module
            for name in node.names:
                imports.append(f"{module}.{name.name}")
    return imports


def check_installed_libraries(imports):
    missing_libraries = []
    for library in imports:
        if not pkgutil.find_loader(library):
            missing_libraries.append(library)
    return missing_libraries


def install_missing_libraries(missing_libraries):
    for library in missing_libraries:
        try:
            subprocess.check_call(['pip', 'install', library])
            # TODO: add to requirements.txt
        except subprocess.CalledProcessError:
            print(f"Failed to install package - {library}")
