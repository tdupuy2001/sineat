import sqlalchemy
from sqlalchemy import MetaData
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.automap import name_for_collection_relationship 
from sqlalchemy.ext.automap import name_for_scalar_relationship
from db_mapping import DBAcces
from db_mapping import Etablissement
from sqlalchemy.orm import Session
from sqlalchemy import select
# import psycopg2

# import faker
# import datetime
# fake = faker.Faker()
# print(str(fake.date_between(datetime.date(2015, 9, 1), datetime.date(2023, 6, 2))).strip("-"))

db = DBAcces("sineat_db", False)

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
    select(Etablissement)
)
result = session.execute(order) 
print(Etablissement)
etablissements_trouves = result.scalars().all()
show_result(
    etablissements_trouves,
    ['id_etablissement', 'nom']
)



# etablissements = session.query(Etablissement).all()
# for etablissement in etablissements:
#     print(etablissement)





# Créez une session
# Session = sessionmaker()
# session = Session()

# Testez la requête avec une de vos classes
# Supposons que vous ayez une table 'User' avec des colonnes comme 'id_user', 'username', etc.
# Vous pouvez tester une requête simple comme celle-ci :

# user_query = session.query(DBAcces.User).first()
# if user_query:
#     print(f"User trouvé: {user_query}")
# else:
#     print("Aucun utilisateur trouvé")

# Répétez ce processus pour les autres tables que vous avez mappées.

# connection_url = "postgresql+psycopg2://sineat_admin:sineat_admin_password@localhost:5432/sineat_db"

# engine = create_engine(
#     connection_url,
#     echo=False,   # si True, pratique pour déboguer (mais très verbeux)
#     future=True,  # pour disposer des fonctionnalités de la version 2.0
# )

# my_metadata = MetaData()

# model_map = {
#     'abonnement': 'Abonnement',
#     'collection': 'Collection',
#     'contenu_collection': 'ContenuCollection',
#     'enregistrement_post': 'EnregistrementPost',
#     'est_commentaire_de': 'EstCommentaireDe',
#     'etablissement': 'Etablissement',
#     'etablissement_de_type': 'EtablissementDeType',
#     'liked_collection': 'LikedCollection',
#     'liked_post': 'LikedPost',
#     'mot_cle': 'MotCle',
#     'mot_cle_post': 'MotClePost',
#     'note': 'Note',
#     'note_concerne': 'NoteConcerne',
#     'post': 'Post',
#     'regime': 'Regime',
#     'regime_etablissement': 'RegimeEtablissement',
#     'regimes_de_l_user': 'RegimeDeLUser',
#     'type_etablissement': 'TypeEtablissement',
#     'type_note': 'TypeNote',
#     'user': 'User'
# }

# my_metadata.reflect(engine, only=model_map.keys())

# # affichage d'une partie des informations découvertes
# for table in my_metadata.tables.values():
#     print(f'{table.name}: {", ".join([att.name for att in table.c])}')

# Base = automap_base(metadata=my_metadata)

# relation_map = {}

# def map_names(type, orig_func):
#     def _map_names(base, local_cls, referred_cls, constraint):
#         auto_name = orig_func(base, local_cls, referred_cls, constraint)
#         # la clé de l'association
#         key = f"{local_cls.__name__}=>{referred_cls.__name__}({constraint.name})"
#         # quelle correpondance ?
#         if key in relation_map: 
#             # Yes, return it
#             name = relation_map[key] 
#         else:
#             name = auto_name
#         # affiche la relation créée (pour comprendre ce qui se passe)
#         print(f"{type}: {key} {auto_name} => {name}") 
#         return name
#     return _map_names

# Base.prepare(
#     name_for_scalar_relationship =
#     map_names('scalar', name_for_scalar_relationship),
#     name_for_collection_relationship =
#     map_names('collection', name_for_collection_relationship),
# )

# # # Affichez les relations de la classe 'Note'
# # print(Note.__mapper__.relationships)