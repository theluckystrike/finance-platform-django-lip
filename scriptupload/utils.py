import os
from django.conf import settings


def handle_script_upload(file):
    print("file recieved", file.name)
    path = f"scripts/{file.name.replace('.py', '')}/{file.name}"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)


def run_script(file):
    # TODO: run in another thread
    script_dir = os.path.dirname(file.file.name)
    os.chdir(script_dir)
    with open(f"{file.name}.py") as f:
        exec(f.read())
    img = [f for f in os.listdir() if f.endswith('.png')]
    if len(img) > 0:
        file.image.name = os.path.join(script_dir, img[-1])
        file.save(update_fields=["image"])
    os.chdir(settings.BASE_DIR)
    # TODO: return error and handle with message if len(img) == 0
