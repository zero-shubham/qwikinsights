from flask_restful import Resource, reqparse
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    fresh_jwt_required
)
import os
from configs import volume
from models.databook import DatabookModel
from models.file import FileModel
from models.user import UserModel
from libs import s3_storage
import configs
import databook_action_handler

_databooks_parser = reqparse.RequestParser()
_databooks_parser.add_argument("databook_name", type=str, required=True, help="This field cannot be blank")
_databooks_parser.add_argument("file_name", type=str, required=False, help="This field cannot be blank")
_databooks_parser.add_argument("store_name", type=str, required=False, help="This field cannot be blank")
_databooks_parser.add_argument("_type", type=str, required=False, help="This field cannot be blank")
_databooks_parser.add_argument("new_store_name", type=str, required=False, help="This field cannot be blank")
_databooks_parser.add_argument("method", type=dict, required=False, help="This field cannot be blank")
_databooks_parser.add_argument("parameters", type=dict, required=False, help="This field cannot be blank")


class DatabookCreate(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _databooks_parser.parse_args()

        current_user_id = get_jwt_identity()
        databook = DatabookModel.find_by_name(data["databook_name"], current_user_id)

        if databook:
            return {"msg": "A databook with that name already exists."}, 403

        databook = DatabookModel(data["databook_name"], current_user_id, data["file_name"])
        databook.save_to_db()
        return {"msg": "New Databook has been created!"}, 200


class DatabookDelete(Resource):
    @classmethod
    @fresh_jwt_required
    def delete(cls):
        data = _databooks_parser.parse_args()

        current_user_id = get_jwt_identity()
        databook = DatabookModel.find_by_name(data["databook_name"], current_user_id)

        if not databook:
            return {"msg": "The Databook was not found."}, 404

        if os.path.isfile("{}/pickle_obj/{}/{}.dtbk".format(volume, current_user_id, data["databook_name"])):
            os.remove("{}/pickle_obj/{}/{}.dtbk".format(volume, current_user_id, data["databook_name"]))

            user = UserModel.find_by_id(current_user_id)
            user.decrement_databooks_size(databook.size)
            databook.delete_from_db()
            return {"msg": "The databook was deleted successfully."}, 200

        return {"msg": "Something went wrong!"}, 500


class DatabookLoad(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _databooks_parser.parse_args()

        current_user_id = get_jwt_identity()
        databook = DatabookModel.find_by_name(data["databook_name"], current_user_id)

        if not databook:
            return {"msg": "No databook with that name found."}, 404

        # below line gets the required data file from s3 if already not present locally
        file = FileModel.find_by_name(databook.file_name, current_user_id)

        if not file:
            return {
                       "msg": "The data-file with the name - {}, for this databook is not found.".format(
                           databook.file_name)
                   }, 404

        user = UserModel.find_by_id(current_user_id)

        allowed_size = (configs.allowed_size[user.account_type]) // 30
        s3_storage.get_file_to_local(databook.file_name, current_user_id, file.path, file.size, allowed_size)

        # think of unpickling logic
        if databook.json()["obj_created"]:
            ret_data = databook_action_handler.unpickle_databook(user_id=current_user_id,
                                                                 databook_name=data["databook_name"])
        else:
            ret_data = databook_action_handler.load_databook(user_id=current_user_id,
                                                             file_path="{}/data/{}/{}/{}".format(volume,
                                                                                                 current_user_id,
                                                                                                 file.path,
                                                                                                 databook.file_name),
                                                             databook_name=data["databook_name"],
                                                             datastore_name=data["store_name"])

        return ret_data, 200


# ======= GET METHODS FOR THE DATBOOK STORE ===========
class DatabookMethods(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _databooks_parser.parse_args()

        current_user_id = get_jwt_identity()
        databook = DatabookModel.find_by_name(data["databook_name"], current_user_id)

        if not databook:
            return {"msg": "No databook with that name found."}, 404

        if current_user_id not in databook_action_handler.loaded_databooks.keys():
            return {"msg": "No databook for this user is loaded yet."}, 404
        if data["databook_name"] not in databook_action_handler.loaded_databooks[current_user_id].keys():
            return {"msg":  "This databook is not loaded, make sure you load it first"}, 403

        ret_data = databook_action_handler.get_methods_and_attr(user_id=current_user_id,
                                                                databook_name=data["databook_name"],
                                                                datastore_name=data["store_name"],
                                                                _type=data["_type"])

        return ret_data, 200


class DatabookUnload(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _databooks_parser.parse_args()
        current_user_id = get_jwt_identity()

        if current_user_id not in databook_action_handler.loaded_databooks.keys():
            return {"msg": "No databook for this user is loaded yet."}, 404
        if data["databook_name"] not in databook_action_handler.loaded_databooks[current_user_id].keys():
            return {"msg":  "This databook is not loaded, make sure you load it first"}, 404

        databook = DatabookModel.find_by_name(data["databook_name"], current_user_id)
        # checking for available space
        if databook.size >= configs.allowed_size[UserModel.find_by_id(current_user_id).json()["account_type"]]:
            return {"msg": "Sorry you don't have enough space to save this databook!"}, 403

        if databook_action_handler.unload_databook(user_id=current_user_id, databook_name=data["databook_name"]):
            databook.set_obj_created()

            databook.size = os.stat("{}/pickle_obj/{}/{}.dtbk".format(volume, current_user_id,
                                                                      data["databook_name"])).st_size
            UserModel.find_by_id(current_user_id).increment_databooks_size(os.stat("{}/pickle_obj/{}/{}.dtbk".format(
                volume,
                current_user_id,
                data["databook_name"])).st_size)

            databook.save_to_db()
            return {"msg": "Done"}, 200

        return {"msg": "Something went wrong."}, 501


class DatabookGetData(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _databooks_parser.parse_args()
        current_user_id = get_jwt_identity()

        if current_user_id not in databook_action_handler.loaded_databooks.keys():
            return {"msg": "No databook for this user is loaded yet."}, 404
        if data["databook_name"] not in databook_action_handler.loaded_databooks[current_user_id].keys():
            return {"msg":  "This databook is not loaded, make sure you load it first"}, 404

        ret_data = databook_action_handler.get_data_for_datastore(current_user_id, data["databook_name"], data["store_name"])

        if ret_data:
            return ret_data, 200

        return {"msg": "No data was found! Most probably such a datastore doesn't exists!"}, 404


class DatabookApplyMethod(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _databooks_parser.parse_args()
        current_user_id = get_jwt_identity()

        if current_user_id not in databook_action_handler.loaded_databooks.keys():
            return {"msg": "No databook for this user is loaded yet."}, 404
        if data["databook_name"] not in databook_action_handler.loaded_databooks[current_user_id].keys():
            return {"msg": "This databook is not loaded, make sure you load it first"}, 404

        parameters = dict()

        if data["parameters"]:
            for key, value in data["parameters"].items():
                if value:
                    try:
                        if "$" in value:
                            # "1:int,2:int$list
                            tmp = value.split("$")
                            # "1:int,2:int", list
                            tmp_elements = tmp[0].split(",")
                            p = []
                            for ele in tmp_elements:
                                # ele = 1:int
                                t = ele.split(":")
                                # t = 1, int
                                if t[1] == "int":
                                    p.append(int(t[0]))
                                elif t[1] == "float":
                                    p.append(float(t[0]))
                                elif t[1] == "str":
                                    p.append(str(t[0]))
                                elif t[2] == "range":
                                    p.append(*[x for x in range(int(t[0]), int(t[1]))])
                            parameters[key] = p
                        else:
                            tmp = value.split(":")
                            if tmp[1] == "int":
                                parameters[key] = int(tmp[0])
                            elif tmp[1] == "float":
                                parameters[key] = float(tmp[0])
                            elif tmp[1] == "str":
                                parameters[key] = str(tmp[0])
                            elif tmp[2] == "range":
                                parameters[key] = [x for x in range(int(tmp[0]), int(tmp[1]))]
                    except (KeyError, ValueError, IndexError) as e:
                        return {"msg": "Some internal error occurred. {}".format(e)}, 501
                else:
                    pass

        ret_data = databook_action_handler.apply_method(current_user_id,
                                                        data["databook_name"],
                                                        data["store_name"],
                                                        data["new_store_name"],
                                                        data["method"],
                                                        parameters)

        return ret_data, 200


class DatabookDatastoreDelete(Resource):
    @classmethod
    @fresh_jwt_required
    def delete(cls):
        data = _databooks_parser.parse_args()

        current_user_id = get_jwt_identity()

        ret_data = databook_action_handler.delete_datastore(
            user_id=current_user_id,
            databook_name=data["databook_name"],
            datastore_name=data["store_name"]
        )

        if ret_data:
            return {"datastore_names": ret_data}, 200
        else:
            return {"msg": "Something went wrong! Make sure the databook is loaded."}, 500
