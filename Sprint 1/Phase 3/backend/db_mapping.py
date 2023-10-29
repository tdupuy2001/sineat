import sqlalchemy
from sqlalchemy import create_engine, MetaData, select
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.automap import automap_base, name_for_collection_relationship, name_for_scalar_relationship
import configparser

config = configparser.ConfigParser()
print(config.read("config.ini"))
print(config.sections())

config_sql = config['SQLBDD']

USER = config_sql["USER"]
PASSWORD = config_sql["PASSWORD"]
HOST = config_sql["HOST"]
PORT = config_sql["PORT"]
DB_NAME = config_sql["DB_NAME"]

TRACE = True

Abonnement = None
Collection = None
ContenuCollection = None
EnregistrementPost = None
EstCommentaireDe = None
Etablissement = None
EtablissementDeType = None
LikedCollection = None
LikedPost = None
MotCle = None
MotClePost = None
Note = None
NoteConcerne = None
Post = None
Regime = None
RegimeEtablissement = None
RegimeDeLUser = None
TypeEtablissement = None
TypeNote = None
User = None

class DBAcces:
    def __init__(self, db_name: str, recreate: bool):
        self.connect_db()
    
    def connect_db(self):
        model_map = {
            'abonnement': 'Abonnement',
            'collection': 'Collection',
            'contenu_collection': 'ContenuCollection',
            'enregistrement_post': 'EnregistrementPost',
            'est_commentaire_de': 'EstCommentaireDe',
            'etablissement': 'Etablissement',
            'etablissement_de_type': 'EtablissementDeType',
            'liked_collection': 'LikedCollection',
            'liked_post': 'LikedPost',
            'mot_cle': 'MotCle',
            'mot_cle_post': 'MotClePost',
            'note': 'Note',
            'note_concerne': 'NoteConcerne',
            'post': 'Post',
            'regime': 'Regime',
            'regime_etablissement': 'RegimeEtablissement',
            'regimes_de_l_user': 'RegimeDeLUser',
            'type_etablissement': 'TypeEtablissement',
            'type_note': 'TypeNote',
            'user': 'User'
        }
        relation_map = {
             'User=>User(user2_fk)': 'aaaa',
             'User=>Post(id_user_liked_post_fk)': 'bbbb',
             'Post=>Post(post1_fk)': 'cccc',
             'Post=>User(id_post_liked_post_fk)': 'dddd',
             'User=>Post(id_user_post_fk)': 'eeee',
         }
    
    
        url_de_connexion = (
                "postgresql+psycopg2://"
                + USER
                + ":" + PASSWORD
                + "@" + HOST
                + ":" + PORT
                + "/" + DB_NAME
            )

        if TRACE:
            print(f"Database URL: {url_de_connexion}")

        sqlalchemy_engine_echo = False # True pour déboguer

        self.engine = create_engine(
            url_de_connexion,
            # si True, pratique pour déboguer (mais très verbeux)
            echo=sqlalchemy_engine_echo,
            # pour disposer des fonctionnalités de la version 2.0
            future=True,
        )
        our_metadata = MetaData()
        our_metadata.reflect(self.engine, only=model_map.keys())
        # print("our_metadata: ok")
        Base = automap_base(metadata=our_metadata)

        class User(Base):
            __tablename__ = 'user'

            def __str__(self):
                return f"User({self.id_user},{self.username})"
            
        class Abonnement(Base):
            __tablename__ = 'abonnement'

            def __str__(self):
                return f"Abonnement({self.id_user1},{self.id_user2})"
            
        class Collection(Base):
            __tablename__ = 'collection'

            def __str__(self):
                return f"Collection({self.id_collection},{self.nom})"
            
        class ContenuCollection(Base):
            __tablename__ = 'contenu_collection'

            def __str__(self):
                return f"Contenu({self.id_collection},{self.id_post})"
            
        class EnregistrementPost(Base):
            __tablename__ = 'enregistrement_post'

            def __str__(self):
                return f"Enregistrement({self.id_user},{self.id_post})"
            
        class Post(Base):
            __tablename__ = 'post'

            def __str__(self):
                return f"Post({self.id_post},{self.type})"
            
        class Note(Base):
            __tablename__ = 'note'

            def __str__(self):
                return f"Note({self.id_user},{self.id_etablissement})"
            
        class Etablissement(Base):
            __tablename__ = 'etablissement'

            def __str__(self):
                return f"Etablissement({self.id_etablissement},{self.nom})"
            
        class EstCommentaireDe(Base):
            __tablename__ = 'est_commentaire_de'

            def __str__(self):
                return f"EstCommentaireDe({self.id_post1},{self.id_post2})"
        
        class EtablissementDeType(Base):
            __tablename__ = 'etablissement_de_type'

            def __str__(self):
                return f"EtablissementDeType({self.id_etablissement},{self.id_type_etablissement})"
        
        class TypeEtablissement(Base):
            __tablename__ = 'type_etablissement'

            def __str__(self):
                return f"TypeEtablissement({self.nom},{self.id_type_etablissement})"
        
        class LikedCollection(Base):
            __tablename__ = 'liked_collection'

            def __str__(self):
                return f"LikedCollection({self.id_user},{self.id_collection})"
        
        class LikedPost(Base):
            __tablename__ = 'liked_post'

            def __str__(self):
                return f"LikedPost({self.id_user},{self.id_post})"

        class MotCle(Base):
            __tablename__ = 'mot_cle'

            def __str__(self):
                return f"MotCle({self.id_mot_cle},{self.mot})"
            
        class MotClePost(Base):
            __tablename__ = 'mot_cle_post'

            def __str__(self):
                return f"MotClePost({self.id_mot_cle},{self.id_post})"
        
        class NoteConcerne(Base):
            __tablename__ = 'note_concerne'

            def __str__(self):
                return f"NoteConcerne({self.id_note},{self.id_type_note})"
            
        class TypeNote(Base):
            __tablename__ = 'type_note'

            def __str__(self):
                return f"TypeNote({self.nom},{self.id_type_note})"
        
        class Regime(Base):
            __tablename__ = 'regime'

            def __str__(self):
                return f"Regime({self.id_regime},{self.nom})"
            
        class RegimeEtablissement(Base):
            __tablename__ = 'regime_etablissement'

            def __str__(self):
                return f"RegimeEtablissement({self.id_etablissement},{self.id_regime})"
            
        class RegimeDeLUser(Base):
            __tablename__ = 'regimes_de_l_user'

            def __str__(self):
                return f"RegimeDeLUser({self.id_user},{self.id_regime})"
            
        def map_names(type, orig_func):
            """fonction d'aide à la mise en correspondance"""
            def _map_names(base, local_cls, referred_cls, constraint):
                auto_name = orig_func(base, local_cls, referred_cls, constraint)
                # la clé de l'association
                key = f"{local_cls.__name__}=>{referred_cls.__name__}({constraint.name})"
                # quelle correpondance ?
                if key in relation_map:
                    # Yes, return it
                    name = relation_map[key]
                else:
                    name = auto_name
                if TRACE:
                    # affiche la relation créée (pour comprendre ce qui se passe)
                    print(f" {type:>10s}: {key} {auto_name} => {name}")
                return name

            return _map_names

        Base.prepare(
            name_for_scalar_relationship=map_names('scalar', name_for_scalar_relationship),
            name_for_collection_relationship=map_names('collection', name_for_collection_relationship),
        )

        # On rend les tables du modèle globales à ce module
        for cls in [
            User, Post, Collection, ContenuCollection,RegimeDeLUser,
            EnregistrementPost, Note, Abonnement, Etablissement,
            EstCommentaireDe, EtablissementDeType, TypeEtablissement,
            LikedCollection, LikedPost, MotCle, MotClePost,
            NoteConcerne, TypeNote, Regime, RegimeEtablissement,
            ]:
            cls.__table__.info = dict(bind_key='main')
            globals()[cls.__name__] = cls

        if TRACE:
            print("DB mapping done.")
    



