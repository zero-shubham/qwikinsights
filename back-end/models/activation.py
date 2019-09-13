from db import db
from sqlalchemy import DateTime


class ActivationModel(db.Model):
    __tablename__ = "activation"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    code = db.Column(db.Integer)
    generated_date = db.Column(DateTime)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("UserModel")

    def __init__(self, email, user_id, code, generated_date):
        self.email = email
        self.user_id = user_id
        self.code = code
        self.generated_date = generated_date

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def update_code(self, code:int, gen_date):
        self.code = code
        self.generated_date = gen_date
        self.save_to_db()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(user_id=_id).first()