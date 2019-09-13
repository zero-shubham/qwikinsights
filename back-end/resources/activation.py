from flask_restful import Resource, reqparse
from flask_jwt_extended import (
    get_jwt_identity,
    fresh_jwt_required
)
from datetime import datetime, timedelta

from models.user import UserModel
from models.activation import ActivationModel
from libs.send_mail import send_code

_activate_parser = reqparse.RequestParser()
_activate_parser.add_argument("code", type=int, required=True, help="This field cannot be black")

_regenerate_parser = reqparse.RequestParser()
_regenerate_parser.add_argument("email", type=str, required=True, help="This field cannot be black")


class ActivationRegenerate(Resource):
    @fresh_jwt_required
    def post(self):
        data = _regenerate_parser.parse_args()
        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)
        if not user:
            return {"msg": "user not found"}, 404
        if user.status == "activated":
            return {"msg": "This user account is already activated."}, 403

        code, date = send_code(to=data["email"])
        user_status = ActivationModel.find_by_id(current_user_id)
        user_status.update_code(code=code, gen_date=date)

        return {"msg": "An activation code has been send to your e-mail."}, 200


class ActivationActivate(Resource):
    @fresh_jwt_required
    def post(self):
        data = _activate_parser.parse_args()
        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)

        if not user:
            return {"msg": "user not found"}, 404
        if user.status == "activated":
            return {"msg": "This user account is already activated."}, 403

        user_status = ActivationModel.find_by_id(current_user_id)

        if user_status.code == data["code"] and (user_status.generated_date + timedelta(days=3)).date() >= datetime.today().date():
            user_status.delete_from_db()
            user.activate()
        else:
            return {"msg": "That is not a valid code or has expired, Please re-generate your activation code."}
        return {"msg": "Your account has been activated."}, 200
