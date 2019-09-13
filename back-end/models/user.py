from werkzeug.security import generate_password_hash
from db import db
from sqlalchemy.dialects.postgresql import ENUM


class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    email = db.Column(db.String(120))
    password = db.Column(db.String(240))
    account_type = db.Column(ENUM("free", "basic", "pro", "enterprise", name="account_type"))
    status = db.Column(ENUM("pending", "activated", name="status"), default="pending")
    files_size = db.Column(db.Integer)
    databooks_size = db.Column(db.Integer)

    files = db.relationship("FileModel")
    databooks = db.relationship("DatabookModel")

    def __init__(self, name, email, password, account_type="free"):
        self.name = name
        self.email = email
        self.password = generate_password_hash(password)
        self.account_type = account_type
        self.files_size = 0
        self.databooks_size = 0

    def json(self):
        return {
            "name": self.name,
            "email": self.email,
            "account_type": self.account_type,
            "files_size": self.files_size,
            "databooks_size": self.databooks_size,
            "status": self.status
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    # ---------------------CONVENIENCE FUNCTIONS---------------------------
    def increment_files_size(self, incr_size: int):
        self.files_size = self.files_size + incr_size
        self.save_to_db()

    def decrement_files_size(self, decr_size: int):
        self.files_size = self.files_size - decr_size
        self.save_to_db()

    def increment_databooks_size(self, incr_size: int):
        self.databooks_size = self.databooks_size + incr_size
        self.save_to_db()

    def decrement_databooks_size(self, decr_size: int):
        self.databooks_size = self.databooks_size - decr_size
        self.save_to_db()
    # ----------------------------------------------------------------------

    def update(self, update_list, data):
        for upd in update_list:
            if upd == "name":
                self.name = data["name"]
            elif upd == "password":
                self.password = generate_password_hash(data["password"])
            elif upd == "account_type":
                self.account_type = data["account_type"]
            elif upd == "email":
                self.email = data["email"]
        self.save_to_db()
        return True

    def activate(self):
        self.status = "activated"
        self.save_to_db()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()