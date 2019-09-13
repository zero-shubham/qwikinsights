import re
from werkzeug.datastructures import FileStorage

from flask_uploads import UploadSet
from libs.s3_storage import upload_to_cloud


FILES = ("xlsx", "csv", "xls", "db", "json")
FILE_SET = UploadSet("files", FILES)


def save_file(file: FileStorage, folder: str = None, name: str = None) -> str:
    print(type(file))
    upload_to_cloud(file, name)
    print("ok-----------------------------------------")
    return FILE_SET.save(file, folder, name)


def is_filename_safe(filename: str) -> bool:
    allowed_format = "|".join(FILES)
    # format IMAGES into regex, eg: ('jpeg','png') --> 'jpeg|png'
    regex = f"^[a-zA-Z0-9][a-zA-Z0-9_()-\\.]*\\.({allowed_format})$"

    return re.match(regex, filename) is not None
