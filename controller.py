
import cherrypy


from helper import Helper
from model import User
from model import RewardUser

class UserController():

    def __init__(self, persistence):
        self.persistence = persistence

    @cherrypy.expose
    @Helper.restful
    def add(self, name, picture):
        session = self.persistence.session()
        try:
            user = User(name, picture)
            session.add(user)
            session.commit()
        finally:
            session.close()
        return "ok"
        
    @cherrypy.expose
    @Helper.restful
    def delete(self, id):
        session = self.persistence.session()
        try:
            query =  session.query(User)
            user = query.get(id)
            if user is not None:
                session.delete(user)
                session.commit()
        finally:        
            session.close()
        return "ok"

    @cherrypy.expose
    @Helper.restful
    def get(self, id):
        retval = {}
        session = self.persistence.session()
        try:
            query = session.query(User)
            user = query.get(id)
            if user is not None:
                session.expunge_all()
                retval = user.todict()
        finally:
            session.close()
        return retval

    @cherrypy.expose
    @Helper.restful
    def get_all(self):
        session = self.persistence.session()
        try:
            users = session.query(User).all()
            user_dicts = {}
            for user in users:
                user_dicts[user.id] = (user.todict())
            session.expunge_all()
        finally:
            session.close()
        return user_dicts

    @cherrypy.expose
    @Helper.restful
    def update_picture(self, id, picture):
        session = self.persistence.session()
        try:
            query = session.query(User)
            user = query.get(id)
            if user is not None:
                user.picture = unicode(picture, "utf-8")
                session.commit()
        finally:
            session.close()

        return "ok"


class RewardUserController():
    
    def __init__(self, persistence):
        self.persistence = persistence

    @cherrypy.expose
    @Helper.restful
    def add(self, id):
        session = self.persistence.session()
        try:
            query = session.query(User)
            if query.get(id) is not None:
               reward_user = RewardUser(id)
               session.add(reward_user)
               session.commit()
        finally:
            session.close()
        return "ok"

    @cherrypy.expose
    @Helper.restful
    def delete(self, id):
        session = self.persistence.session()
        try:
            query = session.query(RewardUser)
            reward_user = query.get(id)
            if reward_user is not None:
                session.delete(reward_user)
                session.commit()
        finally:
            session.close()
        return "ok"

    @cherrypy.expose
    @Helper.restful
    def get(self):
        session = self.persistence.session()
        try:
            reward_users = session.query(RewardUser).all()
            reward_user_list = []
            for reward_user in reward_users:
                reward_user_list.append(str(reward_user.id))
            session.expunge_all()
        finally:
            session.close()
        return reward_user_list

    @cherrypy.expose
    @Helper.restful
    def clear(self):
        session = self.persistence.session()
        try:
            reward_users = session.query(RewardUser).all()
            for reward_user in reward_users:
                session.delete(reward_user)
            session.commit()
        finally:
            session.close()
        return "ok"
