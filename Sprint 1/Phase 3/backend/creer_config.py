#Déjà créé donc pas à relancer.

import configparser
config = configparser.ConfigParser()
config['SQLBDD'] = {'USER': 'sineat_admin',
                     'PASSWORD': 'sineat_admin_password',
                     'HOST': 'localhost',
                     'PORT' : '5432',
                     'DB_NAME' : 'sineat_db'}
with open('config.ini', 'w') as configfile:
  config.write(configfile)