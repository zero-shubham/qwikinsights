from db import db


class DatabookModel(db.Model):
    __tablename__ = "databooks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    file_name = db.Column(db.String(80))
    obj_created = db.Column(db.Boolean, unique=False, default=False)
    size = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("UserModel")

    def __init__(self, name, user_id, file_name):
        self.name = name
        self.user_id = user_id
        self.file_name = file_name
        self.size = 0

    def json(self):
        return {
            "databook_id": self.id,
            "name": self.name,
            "file_name": self.file_name,
            "obj_created": self.obj_created
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def set_obj_created(self):
        self.obj_created = True
        self.save_to_db()

    @classmethod
    def find_by_name(cls, name, user_id):
        return cls.query.filter_by(name=name, user_id=user_id).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
