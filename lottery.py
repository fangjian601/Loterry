'''
Created on 2011-12-9

@author: frank
'''

import os
import logging.config

import cherrypy

from persistence import Persistence
from controller import UserController
from controller import RewardUserController

def home_path():
    real_path = os.path.realpath(__file__)
    return os.path.split(real_path)[0]


def init_path():
    os.chdir(home_path())
    
def init_logger():
    logging.config.fileConfig('conf/logger.ini')    
            

def init_cherrypy():
    cherrypy.config.update('conf/cherrypy.ini')
    cherrypy.config["tools.decode.on"] = True
    cherrypy.config["tools.decode.encoding"] = "utf-8"
    
def start_service(): 
    persistence = Persistence()
    cherrypy.tree.mount(root=UserController(persistence), 
                        script_name="/user")
    cherrypy.tree.mount(root=RewardUserController(persistence), 
                        script_name="/reward")
    root_conf = {'/': {'tools.staticdir.on': True,
                       'tools.staticdir.dir': '%s/static' % home_path(),
                       'tools.staticdir.index': 'lottery.html'}}
    cherrypy.quickstart(None, "/", config=root_conf)         

if __name__ == "__main__":
    init_path()
    init_logger()
    init_cherrypy()
    start_service()
