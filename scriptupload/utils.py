import os
from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files import File
from django.core.files.storage import default_storage

def handle_script_upload(file):
    print("file recieved", file.name)
    path = f"scripts/{file.name.replace('.py', '')}/{file.name}"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)


def run_script(file):
    script_dir = os.path.dirname(file.file.name)
    os.makedirs(script_dir, exist_ok=True)
    os.chdir(script_dir)
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    script = storage.open(file.file.name)
    exec(script.read())
    script.close()
    img = [f for f in os.listdir() if f.endswith('.png')]
    if len(img) > 0:
        i = open(img[-1], 'rb')
        if not storage.exists(os.path.join(script_dir, img[-1])):
            storage.save(os.path.join(script_dir, img[-1]), File(i))
        file.image = os.path.join(script_dir, img[-1])
        file.save(update_fields=["image"])
        i.close()
    os.chdir(settings.BASE_DIR)
