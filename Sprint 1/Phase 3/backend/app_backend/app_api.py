from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db_mapping import DBAcces
import bcrypt

origins = ["http://localhost:3000", "http://localhost:8000", "http://localhost:9456"]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = DBAcces("sineat_db", False)

"""
Création des classes pouvant être utilisés avec FastApi
"""
from pydantic import BaseModel

# class UserSchemaRegister(BaseModel):
#     """
#     Les attributs obligatoires
#     """
#     username : str
#     role : str
#     date_de_naissance : str
#     email : str
#     password : str
#     langue : str

# class UserSchemaUpdate(BaseModel):
#     """
#     Les attributs facultatifs
#     """
#     username : str
#     nom : str
#     prenom : str
#     genre : str
#     adresse : str
#     description : str
#     # class Config:
#     #     orm_mode = True
#  J'aime pas 

class UserSchema(BaseModel):
    """
    Les attributs obligatoires
    """
    username : str
    role : str
    date_de_naissance : str
    email : str
    password : str
    langue : str
    """
    Les attributs facultatifs
    """
    username : str
    nom : str
    prenom : str
    genre : str
    adresse : str
    description : str

"""
Api pour user
"""

from .db_mapping import User

def find_user(username:str, session:Session):
    order = select(User).where(User.username == username)
    result = session.execute(order)
    found_user = result.scalar()
    return(found_user)

# FIXME:
def check_user(password:str, username:str, session:Session):
    order = select(User).where(User.username == username)
    result = session.execute(order).scalar()
    
    encoded_password = password.encode('utf-8')
    stored_password = result.password.encode('utf-8')
    stored_salt = result.salt.encode('utf-8')

    password_to_check = stored_salt + encoded_password
    
    if bcrypt.checkpw(password_to_check, stored_password):
        return True
    else:
        return False

@app.get("/users")
def get_users():
    with Session(db.engine) as session:
        users = session.query(User).all()
        return users


@app.get("/users/{username}")
def get_user(username: str):
    with Session(db.engine) as session:
        user = find_user(username=username, session=session)
        return user


@app.post("/register")
def add_user(user: UserSchema):
    with Session(db.engine) as session:
        found_user = find_user(user.username, session)
        if found_user != None:
            return found_user
        else: 
            user_salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), user_salt)
            new_user = User(
                username = user.username,
                role = "user",
                date_de_naissance = user.date_de_naissance,
                email = user.email,
                password = hashed_password,
                salt = user_salt,
                langue = user.langue
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            return new_user

# @app.put("/users")
# def put_user(user: UserSchemaUpdate):
#     with Session(db.engine) as session:
#         found_user = find_user(user.username, session)
#         # Non changeable
#         found_user.nom = user.nom
#         found_user.prenom = user.prenom
#         found_user.genre = user.genre
#         found_user.adresse = user.adresse
#         found_user.description = user.description
#         session.commit()
# J'aime pas trop la facon de faire

@app.put("/users")
def put_user(user: UserSchema):
    # TODO:
    # Je pense qu'il y a des problèmes de sécu
    # Et donc il faudrait pouvoir modifier le mdp
    # Mais ailleurs, et vérifier que c'est bien l'user qui demande à faire la modif
    with Session(db.engine) as session:
        found_user = find_user(user.username, session)
        if check_user(found_user.password,user.username,session):
            # Non modifiable
            found_user.date_de_naissance = found_user.date_de_naissance if user.date_de_naissance != found_user.date_de_naissance else user.date_de_naissance
            found_user.email = found_user.email if user.email != found_user.email else user.email
            found_user.password = found_user.password if user.password != found_user.password else user.password
            found_user.langue = found_user.langue if user.langue != found_user.langue else user.langue
            
            # Modifiable
            found_user.nom = user.nom
            found_user.prenom = user.prenom
            found_user.genre = user.genre
            found_user.adresse = user.adresse
            found_user.description = user.description
            session.commit()
        else:
            return {'message': "Vous n'avez pas les droits de modifier ce profil"}
        
        
# if __name__=="__main__":
#     session = Session(db.engine)
#     print(find_user(username="RGuillou",session=session),find_user(username="AGoeury",session=session))
    
#     test_user = User(
#             username="test_user",
#             date_de_naissance="1990-01-01",
#             email="test@example.com",
#             password="test_password",
#             langue="fr"
#         )
    
#     add_user(test_user)
    
#     print(find_user(username="test_user",session=session))