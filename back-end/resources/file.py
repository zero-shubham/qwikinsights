from flask_restful import Resource, reqparse
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    fresh_jwt_required
)
import json

from models.file import FileModel
from models.user import UserModel
from libs import s3_storage
import configs

_datafile_parser = reqparse.RequestParser()
_datafile_parser.add_argument("files", type=str, required=False, help="This field cannot be blank")
_datafile_parser.add_argument("file_path", type=str, required=False, help="This field cannot be blank")
_datafile_parser.add_argument("file_name", type=str, required=False, help="This field cannot be blank")


class FileUploadLink(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _datafile_parser.parse_args()

        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)

        links = list()
        total_size = 0

        # "files in data[] contains a list/array of files object/dict which contains file name and size
        for file_obj in json.loads(data["files"]):
            file = FileModel.find_by_name(name=file_obj["name"], user_id=current_user_id)

            if file:
                return {"msg": "A file with that name already exists!"}, 403

            if user.files_size + file_obj["size"] >= configs.allowed_size[user.account_type]:
                return {"msg": "Not enough space to upload!"}, 403

            # links is a list of upload link, so it is appended with link for each file
            links.append(s3_storage.get_upload_url(file_obj["name"], current_user_id, data["file_path"]))

            file = FileModel(file_obj["name"], current_user_id, data["file_path"], file_obj["size"])
            file.save_to_db()

            total_size += file_obj["size"]

        # updating the total size of files the user currently has
        user.increment_files_size(total_size)

        return {"links": links}, 200


class FileDelete(Resource):
    @classmethod
    @fresh_jwt_required
    def delete(cls):
        data = _datafile_parser.parse_args()

        current_user_id = get_jwt_identity()
        file = FileModel.find_by_name(name=data["file_name"], user_id=current_user_id)

        if not file:
            return {"msg": "The file was not found."}, 404

        file_path = file.path
        s3_storage.delete_file(data["file_name"], current_user_id, file_path)

        user = UserModel.find_by_id(current_user_id)
        user.decrement_files_size(file.size)

        file.delete_from_db()
        return {"msg": "The file was deleted successfully."}, 200

