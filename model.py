

import sqlalchemy

from persistence import ORMBase

class User(ORMBase):

    __tablename__ = "users"
    id = sqlalchemy.Column(sqlalchemy.Integer, nullable=False,
                           unique=True, primary_key=True)
    name = sqlalchemy.Column(sqlalchemy.Text, nullable=False)
    picture = sqlalchemy.Column(sqlalchemy.Text, nullable=False)

    def __init__(self, name, picture):
        self.name = unicode(name, "utf-8")
        self.picture = picture

    def todict(self):
        user_dict = {}
        user_dict["id"] = self.id
        user_dict["name"] = self.name
        user_dict["picture"]=  self.picture
        return user_dict

class RewardUser(ORMBase):

    __tablename__ = "reward_users"
    id = sqlalchemy.Column(sqlalchemy.Integer, nullable=False,
                           unique=True, primary_key=True)

    def __init__(self, id):
        self.id = id
