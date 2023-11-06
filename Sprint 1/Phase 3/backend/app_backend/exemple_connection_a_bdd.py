import sqlalchemy
from sqlalchemy import MetaData
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.automap import name_for_collection_relationship 
from sqlalchemy.ext.automap import name_for_scalar_relationship
from db_mapping import DBAcces
from sqlalchemy.orm import Session
from sqlalchemy import select
# import psycopg2


db = DBAcces("sineat_db", False)

from db_mapping import Note, NoteConcerne # Import des classes après l'initialisation 

def show_result(result, fields):
    for elem in result:
        print(" ".join([str(getattr(elem,field,None)) for field in fields]))

session = Session(db.engine)
# print(db.engine)

#Verification que j'arrive bien à me connecter à la bdd

# conn = psycopg2.connect(
#     dbname="sineat_db",
#     user="sineat_admin",
#     password="sineat_admin_password",
#     host="localhost",
#     port="5432"
# )
# try:
#     cursor = conn.cursor()
#     cursor.execute("SELECT version();")
#     record = cursor.fetchone()
#     print("Vous êtes connecté à - ", record, "\n")

# except (Exception, psycopg2.Error) as error:
#     print("Erreur lors de la connexion à PostgreSQL", error)

# finally:
#     # Fermer la communication avec la base de données
#     if conn:
#         cursor.close()
#         conn.close()
#         print("La connexion à PostgreSQL est fermée")

# On arrive bien à ce connecter 

order = (
    select(Note)
)
result = session.execute(order) 
etablissements_trouves = result.scalars().all()
show_result(
    etablissements_trouves,
    ['id_note', 'id_etablissement', 'id_user']
)

