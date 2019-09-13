from db import db
from sqlalchemy import distinct


class FileModel(db.Model):
    __tablename__ = "files"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    path = db.Column(db.String(240))
    size = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("UserModel")

    def __init__(self, name, user_id, path, size):
        self.name = name
        self.user_id = user_id
        self.path = path
        self.size = size

    def json(self):
        return {
            "name": self.name,
            "file_id": self.id
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name, user_id):
        return cls.query.filter_by(name=name, user_id=user_id).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def get_unique_filepaths(cls, user_id):
        return cls.query.filter_by(user_id=user_id).distinct(cls.path).all()

