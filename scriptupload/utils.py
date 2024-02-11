"""
Configures utility (helper) functions to be used in other places in the project.
"""


from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files import File
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import default_storage
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
import ast
import pkgutil
import subprocess
import logging
import matplotlib.pyplot as plt
import matplotlib as mpl
import importlib
from django.utils import timezone
# from django.apps import apps

# ScriptRunResult = apps.get_model("scriptupload", "ScriptRunResult")



#  from https://stackoverflow.com/questions/65569673/htmx-hx-target-swap-html-vs-full-page-reload
class HTTPResponseHXRedirect(HttpResponseRedirect):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self['HX-Redirect'] = self['Location']
    status_code = 200


plt.switch_backend("agg")
original_save_func = plt.savefig

logger = logging.getLogger('testlogger')


def get_script_hierarchy(scripts):
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
    categories = dict()
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
    subtitle_text = timezone.now().strftime('%d %B %Y %H:%M')
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
        annotation = f"Source script: {script.name}, Last Updated: {script.last_updated.strftime('%d %B %Y %H:%M')}"
        annotation_x_pos = (
            page_width - c.stringWidth(annotation, "Helvetica", 8)) / 2
        c.setFont("Helvetica", 8)
        c.drawString(annotation_x_pos, y, annotation)
        y += 20
        x = (page_width-this_image_width)/2
        c.drawImage(storage.url(script.image.name), x, y,
                    width=this_image_width, height=this_image_height)
        y -= 60
        return x, y

    script_hierarchy, uncatagorised = get_script_hierarchy(scripts)

    # draw all of the headings and script charts

    for heading in script_hierarchy.keys():
        for subheading in script_hierarchy[heading]["subcategories"].keys():
            # sort by subsubcategory alphabetically
            subsubheadings = sorted(script_hierarchy[heading]["subcategories"]
                                    [subheading]["subsubcategories"].keys(), key=lambda cat: cat.name)
            for subsubheading in subsubheadings:
                # draw heading
                subheading_text = f"{heading} -> {subheading} -> {subsubheading}"
                c.setFont("Helvetica-Bold", 14)
                c.drawString(x, y, subheading_text)
                y -= 40
                for script in script_hierarchy[heading]["subcategories"][subheading]["subsubcategories"][subsubheading]:
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
        categoryname if categoryname else "CustomReport", timezone.now().strftime("%d_%m_%Y_%H_%M")
    )
    # close buffer and return http response
    buffer.close()
    return response


plot_buffer = None


def custom_savefig(*args, **kwargs):
    global plot_buffer

    if args and isinstance(args[0], str):
        buf = BytesIO()
        # original_save_func(buf, format='png', **kwargs)
        original_save_func(buf, format='png', dpi=300)
        buf.seek(0)
        plot_buffer = buf


def custom_show(*args, **kwargs):
    # https://matplotlib.org/stable/gallery/user_interfaces/web_application_server_sgskip.html
    # monkey patch function to prevent memory leak in matplotlib.pyplot
    pass


def run_script(script_instance):
    """
    Runs a script and saves the result back to storage, deleting the previous version.

    :param file: The file that contains the script to be run.
    :return: True if ran script with no errors, stacktrace as string
    otherwise.
    """
    global plot_buffer
    global plt
    logger.info(f"[script runner] Running script * {script_instance.name} *")
    script_instance.status = "running"
    script_instance.error_message = ""
    script_instance.save(update_fields=["status", "error_message"])

    script = script_instance.file
    plt = importlib.reload(plt)

    plt.savefig = custom_savefig
    plt.show = custom_show
    script_namespace = {
        'plt': plt
    }

    try:
        exec(script.read(), script_namespace)
    except Exception as e:
        script_instance.status = "failure"
        script_instance.error_message = e
        script_instance.save(update_fields=["status", "error_message"])
        logger.error(
            f"[script runner] Failed to run script * {script_instance.name} * with error -> \n{e}")
        return False, e
    if plot_buffer:
        script_instance.image.save("output_plot.png", File(plot_buffer))
        plot_buffer.close()
        plot_buffer = None
        script_instance.last_updated = timezone.now()
        script_instance.save(update_fields=["last_updated"])
        script_instance.status = "success"
        script_instance.save(update_fields=["status"])
        logger.info(
            f"[script runner] Successfully ran script * {script_instance.name} *")
        return True, None
    else:
        # savefig has been monkey patched
        plt.savefig("output_plot_forced.png", dpi=300)
        if plot_buffer:
            script_instance.image.save(
                "output_plot_forced.png", File(plot_buffer))
            plot_buffer.close()
            plot_buffer = None
            script_instance.last_updated = timezone.now()
            script_instance.save(update_fields=["last_updated"])
            script_instance.status = "success"
            script_instance.save(update_fields=["status"])
            logger.info(
                f"[script runner] Successfully ran script * {script_instance.name} *")
            return True, None
    script_instance.status = "failure"
    script_instance.error_message = "Could not find script plot"
    script_instance.save(update_fields=["status", "error_message"])
    logger.error(
        f"[script runner] The script * {script_instance.name} * did not output an image")
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


def handover(user, script):
    if user is None:
        username = "None"
    else:
        username = user.username
    success, message = run_script(script)
    logger.info(
        f"[script handover] Running script * {script.name} * by user * {username} *")
    if success:
        logger.info(
            f"[script handover] Script * {script.name} * run by user * {username} * SUCCESS")
    else:
        logger.info(
            f"[script handover] Script * {script.name} * run by user * {username} * FAILURE")


def handover_report(user, report, run_scripts=False):
    if user is None:
        username = "None"
    else:
        username = user.username
    logger.info(
        f"[report handover] Updating report * {report.name} * by user * {username} *")
    report.update(run_scripts)
    report.status = "success"
    report.save(update_fields=["status"])
    logger.info(
        f"[report handover] Updated report * {report.name} * by user * {username} *")
