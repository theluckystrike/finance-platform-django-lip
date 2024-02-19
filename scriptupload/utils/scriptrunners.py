import matplotlib.pyplot as plt
from django.core.files import File
from django.utils import timezone
from io import BytesIO
import logging

logger = logging.getLogger('testlogger')


plt.switch_backend("agg")
ORIGINAL_PLT_SAVE = plt.savefig


def run_script_matplotlib_pyplot(script_instance):
    """
    Runs a script and saves the result back to storage, deleting the previous version.

    :param file: The file that contains the script to be run.
    :return: True if ran script with no errors, stacktrace as string
    otherwise.
    """
    logger.info(f"[script runner] Running script * {script_instance.name} *")

    import matplotlib.pyplot as plt
    PLOT_BUFFER = BytesIO()

    def custom_show(*args, **kwargs):
        # https://matplotlib.org/stable/gallery/user_interfaces/web_application_server_sgskip.html
        # monkey patch function to prevent memory leak in matplotlib.pyplot
        plt.close('all')

    def custom_savefig(*args, **kwargs):

        if args and isinstance(args[0], str):
            ORIGINAL_PLT_SAVE(PLOT_BUFFER, format='png', dpi=300)
            PLOT_BUFFER.seek(0)

    script = script_instance.file
    if script_instance.status != "running":
        script_instance.status = "running"
        script_instance.error_message = ""
        script_instance.save(update_fields=["status", "error_message"])

    plt.savefig = custom_savefig
    plt.show = custom_show

    script_namespace = {
        'plt': plt,
    }

    success_flag = False
    error_message = ""

    try:
        exec(script.read(), script_namespace)
    except Exception as e:
        # try this: exc_info = sys.exc_info()
        # exc_string = ''.join(traceback.format_exception(*exc_info))
        logger.error(
            f"[script runner] Failed to run script * {script_instance.name} * with error -> \n{e}")
        script_instance.status = "failure"
        script_instance.error_message = e
        script_instance.save(update_fields=["status", "error_message"])
        error_message = str(e)

    if PLOT_BUFFER:
        script_instance.image.save("output_plot.png", File(PLOT_BUFFER))
        script_instance.last_updated = timezone.now()
        script_instance.status = "success"
        script_instance.save(update_fields=["status", "last_updated"])
        logger.info(
            f"[script runner] Successfully ran script * {script_instance.name} *")
        success_flag = True
    else:
        # savefig has been monkey patched
        plt.savefig("output_plot_forced.png", dpi=300)
        if PLOT_BUFFER:
            script_instance.image.save(
                "output_plot_forced.png", File(PLOT_BUFFER))
            script_instance.last_updated = timezone.now()
            script_instance.status = "success"
            script_instance.save(update_fields=["status", "last_updated"])
            logger.info(
                f"[script runner] Successfully ran script * {script_instance.name} *")
            success_flag = True
        else:
            script_instance.status = "failure"
            script_instance.error_message = "Could not find script plot, are you using matplotlib.pyplot?"
            script_instance.save(update_fields=["status", "error_message"])
            logger.error(
                f"[script runner] The script * {script_instance.name} * did not output an image")
            error_message = "Could not find script plot"

    PLOT_BUFFER.close()
    plt.close('all')
    del plt, PLOT_BUFFER
    return success_flag, error_message
