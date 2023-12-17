"""
Configures utility (helper) functions to be used in other places in the project.
"""


from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files import File
from django.http import HttpResponse
from django.core.files.storage import default_storage
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
from io import BytesIO
import ast
import pkgutil
import subprocess
import logging
import matplotlib.pyplot as plt


logger = logging.getLogger('testlogger')


def get_script_list(scripts):
    """
    {
        cat1: [
            subcat1: [
                subsubcat1: script query set,
                subsubcat2: script query set,
                ...
            ],
            ...
        ],
        ...
    ]
    """
    categories = {}
    uncategorised = []
    for script in scripts:
        if not script.category:
            uncategorised.append(script)
            continue
        cat = script.category.parent_category.parent_category
        subcat = script.category.parent_category
        subsubcat = script.category
        if cat not in categories.keys():
            categories[cat] = {
                "subcategories": {
                    subcat: {
                        "subsubcategories": {
                            subsubcat: [script]
                        }
                    }
                }
            }
            continue
        if subcat not in categories[cat]["subcategories"].keys():
            categories[cat]["subcategories"][subcat] = {
                "subsubcategories": {
                    subsubcat: [script]
                }
            }
            continue
        if subsubcat not in categories[cat]["subcategories"][subcat]["subsubcategories"].keys():
            categories[cat]["subcategories"][subcat]["subsubcategories"][subsubcat] = [
                script]
            continue
        categories[cat]["subcategories"][subcat]["subsubcategories"][subsubcat].append(
            script)
    return categories, uncategorised


def scripts_to_pdfbuffer(scripts, categoryname=None, runscripts=False):
    """
    Converts a report that was generated to a PDF file.

    :param category: The category that the report was generated for.
    :return: The PDF file.
    """
    if len(scripts) == 0:
        return None
    # get storage
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    # get urls of each script image
    if runscripts:
        for script in scripts:
            run_script(script)

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
    # subtitle
    subtitle_text = datetime.now().strftime('%d %B %Y %H:%M')
    subtitle_width = c.stringWidth(subtitle_text, "Helvetica", 12)
    x = (page_width - subtitle_width) / 2
    y -= 20
    c.setFont("Helvetica", 12)
    c.drawString(x, y, subtitle_text)
    c.setFont("Helvetica-Bold", 18)

    # add the images to the pdf
    page_top = page_height - 100
    page_bottom = 50
    x, y = (page_width-500)/2, page_top - 20

    # TODO: should probably be its own function
    def draw_script(x, y, script):
        if not script.image:
            return x, y
        this_image_width = 500
        this_image_height = (script.image.height) * \
            (this_image_width/script.image.width) + 20

        if this_image_height > page_top-page_bottom:
            logger.error(
                f"[scripts to buffer converter] Script *{script.name}* had an image that is too high")
            # scale width according to height
            this_image_height = page_top-page_bottom - 50
            this_image_width = (script.image.width) * \
                (this_image_height/script.image.height)

        y -= this_image_height
        if y < page_bottom:
            c.showPage()
            y = page_top - this_image_height
        # draw script source below script
        annotation = f"Source script: {script.name}"
        annotation_x_pos = (
            page_width - c.stringWidth(annotation, "Helvetica", 11)) / 2
        c.setFont("Helvetica", 11)
        c.drawString(annotation_x_pos, y, annotation)
        y += 20
        x = (page_width-this_image_width)/2
        c.drawImage(storage.url(script.image.name), x, y,
                    width=this_image_width, height=this_image_height)
        y -= 60
        return x, y

    script_hierarchy, uncatagorised = get_script_list(scripts)

    # draw all of the headings and script charts
    for heading in script_hierarchy.keys():
        for subheading in script_hierarchy[heading]["subcategories"].keys():
            for subsubheading in script_hierarchy[heading]["subcategories"][subheading]["subsubcategories"].keys():
                # draw heading
                subheading_text = f"{heading} -> {subheading} -> {subsubheading}"
                c.setFont("Helvetica-Bold", 14)
                c.drawString(x, y, subheading_text)
                y -= 40
                for script in script_hierarchy[heading]["subcategories"][subheading]["subsubcategories"][subsubheading]:
                    # skip if this script does not have an image
                    x, y = draw_script(x, y, script)
                # new page for new category and reset y position
                c.showPage()
                y = page_top
    if len(uncatagorised) > 0:
        subheading_text = "Uncategorised"
        c.setFont("Helvetica-Bold", 14)
        c.drawString(x, y, subheading_text)
        y -= 40
        for script in uncatagorised:
            x, y = draw_script(x, y, script)
        c.showPage()
    # save to buffer
    c.save()
    # reset the buffer position
    buffer.seek(0)
    return buffer


def scripts_to_httpresponse(scripts, categoryname=None, runscripts=False):
    buffer = scripts_to_pdfbuffer(scripts, categoryname, runscripts)
    # create response for downloading file
    response = HttpResponse(buffer.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="{}_report_{}.pdf"'.format(
        categoryname if categoryname else "CustomReport", datetime.now().strftime("%d_%m_%Y_%H_%M")
    )
    # close buffer and return http response
    buffer.close()
    return response


plot_buffer = None
original_save_func = plt.savefig


def custom_savefig(*args, **kwargs):
    global plot_buffer

    if args and isinstance(args[0], str):
        buf = BytesIO()
        original_save_func(buf, format='png', **kwargs)
        buf.seek(0)
        plot_buffer = buf


def update_report_pdf(report, runscripts=False):
    scripts = report.scripts.all()
    buffer = scripts_to_pdfbuffer(scripts, report.name, runscripts)
    report.latest_pdf.save(
        f"{report.name}_report_{datetime.now().strftime('%d_%m_%Y_%H_%M')}.pdf", File(buffer))
    buffer.close()

# run the script assuming that it saves the chart image as output


def run_script(script_instance):
    """
    Runs a script and saves the result back to storage, deleting the previous version.

    :param file: The file that contains the script to be run.
    :return: True if ran script with no errors, stacktrace as string
    otherwise.
    """
    global plot_buffer

    script = script_instance.file
    import matplotlib.pyplot as plt

    plt.savefig = custom_savefig
    plt.switch_backend("Agg")
    script_namespace = {
        'plt': plt
    }

    try:
        exec(script.read(), script_namespace)
    except Exception as e:
        return False, e

    if plot_buffer:
        script_instance.image.save("test.png", File(plot_buffer))
        plot_buffer.close()
        plot_buffer = None

        return True, None
    else:
        plt.savefig("test2.png", dpi=300)
        if plot_buffer:
            script_instance.image.save("test.png", File(plot_buffer))
            plot_buffer.close()
            plot_buffer = None
            return True, None
    return False, "Could not find script plot"

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
