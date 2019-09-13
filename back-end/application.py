from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from blacklist import BLACKLIST
from flask_cors import CORS

from resources.user import (
    UserRegister,
    User,
    UserLogin,
    UserLogout,
    UserRefresh,
    UserFiles,
    UserDatabooks,
    UserFilePaths,
    UserEdit
)
from resources.file import FileUploadLink, FileDelete
from resources.activation import ActivationActivate, ActivationRegenerate
from resources.databook import (
    DatabookCreate,
    DatabookDelete,
    DatabookLoad,
    DatabookMethods,
    DatabookUnload,
    DatabookGetData,
    DatabookApplyMethod,
    DatabookDatastoreDelete
)
from db import db

application = app = Flask(__name__)

CORS(app, origins=[r"https://app.qwikinsights.com", r"http://localhost:8080"], supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:12341234@database-1.ch87ikotury1.us-east-2.rds.amazonaws.com"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["PROPAGATE_EXCEPTIONS"] = True

app.config['JWT_CSRF_IN_COOKIES'] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_METHODS'] = ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']

app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = "/"

app.config["JWT_BLACKLIST_ENABLED"] = True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]

app.secret_key = "cool"

api = Api(app)

db.init_app(application)
@app.before_first_request
def create_tables():
    db.create_all()


jwt = JWTManager(app)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token["jti"] in BLACKLIST


api.add_resource(UserRegister, "/register")
api.add_resource(UserLogin, "/login")
api.add_resource(UserLogout, "/logout")
api.add_resource(UserRefresh, "/refresh")

# user account activation
api.add_resource(ActivationActivate, "/activation/activate")
api.add_resource(ActivationRegenerate, "/activation/regenerate")
# get user details for the logged-in user
api.add_resource(User, "/user")
api.add_resource(UserEdit, "/user/edit")
# get all the files for the logged-in user
api.add_resource(UserFiles, "/user/files")
api.add_resource(UserFilePaths, "/user/filepaths")

# get all the databooks for the logged-in user
api.add_resource(UserDatabooks, "/user/databooks")

# these are subject to change
api.add_resource(FileUploadLink, "/file/upload")
api.add_resource(FileDelete, "/file/delete")

api.add_resource(DatabookCreate, "/databook/create")
api.add_resource(DatabookDelete, "/databook/delete")

api.add_resource(DatabookLoad, "/databook/load")
api.add_resource(DatabookUnload, "/databook/unload")

api.add_resource(DatabookGetData, "/databook/getdata")
api.add_resource(DatabookMethods, "/databook/getmethods")
api.add_resource(DatabookApplyMethod, "/databook/applymethod")
api.add_resource(DatabookDatastoreDelete, "/databook/datastore/delete")

if __name__ == "__main__":
    application.run(debug=True)
