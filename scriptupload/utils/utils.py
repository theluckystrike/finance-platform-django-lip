"""
Configures utility (helper) functions to be used in other places in the project.
"""


from django.conf import settings
from .scriptrunners import run_script_matplotlib_pyplot
from financeplatform.storage_backends import PrivateMediaStorage
from django.http import HttpResponse, HttpResponseRedirect
from django.core.files.storage import default_storage
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
import logging
from django.utils import timezone
import gc
# from django.apps import apps
# ScriptRunResult = apps.get_model("scriptupload", "ScriptRunResult")


#  from https://stackoverflow.com/questions/65569673/htmx-hx-target-swap-html-vs-full-page-reload
class HTTPResponseHXRedirect(HttpResponseRedirect):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self['HX-Redirect'] = self['Location']
    status_code = 200


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
            run_script_matplotlib_pyplot(script)

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
    del c
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


def handover_script(user, script):
    if user is None:
        username = "None"
    else:
        username = user.username
    logger.info(
        f"[script handover] Running script * {script.name} * for user * {username} *")
    success, message = run_script_matplotlib_pyplot(script)
    if success:
        logger.info(
            f"[script handover] Script * {script.name} * run by user * {username} * SUCCESS")
    else:
        logger.info(
            f"[script handover] Script * {script.name} * run by user * {username} * FAILURE")
    gc.collect()


def handover_report(user, report, run_scripts=False):
    if user is None:
        username = "None"
    else:
        username = user.username
    logger.info(
        f"[report handover] Updating report * {report.name} * for user * {username} *")
    report.update(run_scripts)
    gc.collect()
    logger.info(
        f"[report handover] Finished update of report * {report.name} * for user * {username} *")
