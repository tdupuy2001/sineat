import sqlalchemy
from sqlalchemy import create_engine, MetaData, select
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.automap import automap_base, name_for_collection_relationship, name_for_scalar_relationship

USER = "sineat_admin"
PASSWORD = "sineat_admin_password"
HOST = "localhost"
PORT = "5432"
DB_NAME = "sineat_db"

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
            # l'association 1:N entre User et Post
            'User=>Post(post_author_id_fkey)': 'all_posts',
            'Post=>User(post_author_id_fkey)': 'author',
            # l'association N:M entre Post et User (via LikedPost)
            'Post=>LikedPost(star_post_id_fkey)': 'all_stars',
            'User=>LikedPost(star_user_id_fkey)': 'all_stars',
            'Post=>User(star_post_id_fkey)': 'all_liked_post_users',
            'User=>Post(star_user_id_fkey)': 'all_liked_posts',
            # l'association N:M entre User et Etablissement (via Note)
            'Etablissement=>Note(note_id_etablissement_fkey)': 'all_notes',
            'User=>Note(note_id_user_fkey)': 'all_notes',
            'Post=>User(star_post_id_fkey)': 'all_liked_post_users',
            'User=>Post(star_user_id_fkey)': 'all_liked_posts',

            
        }
    # relation_map = {
    # 'User=>Post(post_author_id_fkey)': 'all_posts',
    # 'Post=>User(post_author_id_fkey)': 'author',
    # 'Note=>Etablissement(id_etablissement_fkey)': 'all_notes',
    # 'Etablissement=>Note(id_etablissement_fkey)': 'etablissement',
    # 'Note=>User(id_user_fkey)': 'user_notes',
    # 'User=>Note(id_user_fkey)': 'user',
    # # ...
    # }

    



