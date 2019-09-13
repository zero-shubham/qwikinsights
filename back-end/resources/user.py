from flask_restful import Resource, reqparse
from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_csrf_token
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    get_raw_jwt,
    jwt_refresh_token_required,
    fresh_jwt_required
)

import datetime
from libs.send_mail import send_code
from models.file import FileModel
from models.activation import ActivationModel
from models.user import UserModel
from blacklist import BLACKLIST
from databook_action_handler import unload_databook, loaded_databooks


_userRegister_parser = reqparse.RequestParser()
_userRegister_parser.add_argument("name", type=str, required=True, help="This field cannot be black")
_userRegister_parser.add_argument("email", type=str, required=True, help="This field cannot be black")
_userRegister_parser.add_argument("password", type=str, required=True, help="This field cannot be black")

_user_parser = reqparse.RequestParser()
_user_parser.add_argument("name", type=str, required=False, help="This field cannot be black")
_user_parser.add_argument("email", type=str, required=True, help="This field cannot be black")
_user_parser.add_argument("password", type=str, required=True, help="This field cannot be black")
_user_parser.add_argument("changes", type=list, required=False, help="This field cannot be black")


class UserRegister(Resource):

    def post(self):
        data = _userRegister_parser.parse_args()
        if UserModel.find_by_email(data["email"]):
            return {"msg": "A user with that username already exist"}, 400

        code, date = send_code(to=data["email"])
        if code:
            user = UserModel(
                name=data["name"],
                email=data["email"],
                password=data["password"],
            )
            user.save_to_db()
            ActivationModel(email=data["email"], user_id=user.id, code=code, generated_date=date).save_to_db()

        return {"msg": "An activation code has been send to your e-mail."}, 200


class User(Resource):

    @classmethod
    @jwt_required
    def get(cls):
        user = UserModel.find_by_id(get_jwt_identity())
        if not user:
            return {"msg": "user not found"}, 404
        return user.json()

    @classmethod
    @fresh_jwt_required
    def delete(cls):
        user = UserModel.find_by_id(get_jwt_identity())
        if not user:
            return {"msg": "user not found"}, 404
        user.delete_from_db()
        return {"msg": "user deleted"}


class UserLogin(Resource):
    def post(self):
        data = _user_parser.parse_args()

        user = UserModel.find_by_email(data["email"])

        try:
            if user and check_password_hash(user.password, data["password"]):
                expires = datetime.timedelta(days=3)
                access_token = create_access_token(identity=user.id, fresh=True, expires_delta=expires)
                refresh_token = create_refresh_token(user.id)

                resp = jsonify({
                    "csrf": get_csrf_token(access_token),
                    "refresh_csrf": get_csrf_token(refresh_token)
                })
                resp.status_code = 200

                set_access_cookies(resp, access_token)
                set_refresh_cookies(resp, refresh_token)
                return resp
        except Exception as e:
            return {"msg" : "this happened: {}".format(e)}, 500

        return {"msg": "invalid credentials"}, 404


class UserRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()

        access_token = create_access_token(identity=current_user, fresh=False)
        refresh_token = create_refresh_token(current_user)

        resp = jsonify({
            "csrf": get_csrf_token(access_token),
            "refresh_csrf": get_csrf_token(refresh_token)
        })
        resp.status_code = 200

        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        return resp


class UserFiles(Resource):
    @jwt_required
    def get(self):
        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)
        files = [file.json() for file in user.files]

        if not files:
            return {"msg": "No files found for this user!"}, 200
        else:
            return {"files": files}, 200


class UserDatabooks(Resource):
    @jwt_required
    def get(self):
        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)
        databooks = [databook.json() for databook in user.databooks]
        if not databooks:
            return {"msg": "No databooks found for this user!"}, 200
        else:
            return {"databooks": databooks}, 200


class UserFilePaths(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        current_user_id = get_jwt_identity()
        paths = [file.path for file in FileModel.get_unique_filepaths(current_user_id)]
        return {"file_paths": paths}, 200


class UserLogout(Resource):
    @jwt_required
    def post(self):
        # this will later change to accommodate multiple users simultaneously from one enterprise account
        current_user_id = get_jwt_identity()
        if unload_databook(current_user_id, "all"):
            del loaded_databooks[current_user_id]

        jti = get_raw_jwt()["jti"]
        BLACKLIST.add(jti)
        return {"login": False}, 200


class UserEdit(Resource):
    @fresh_jwt_required
    def post(self):
        data = request.get_json()

        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)

        change_dict = dict()

        if len(data["changes"]) != len(data.keys()) - 1:
            return {"msg": "Passed data mismatch"}, 400

        if list(filter(lambda x: x not in["password", "name", "email"], data["changes"])):
            return {"msg": "Update not allowed!"}, 403

        try:
            for change in data["changes"]:
                change_dict[change] = data[change]
        except KeyError:
            return {"msg": "Passed data mismatch"}, 400

        if user.update(data["changes"], change_dict):
            return {"msg": "Updates have been made."}, 200
        else:
            return {"msg": "Something went wrong!"}, 500
