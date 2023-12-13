from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db_mapping import DBAcces
import bcrypt
import logging

logging.basicConfig(
    filename='app.log',  # Nom du fichier de logs
    filemode='a',  # Mode d'écriture du fichier ('a' pour append, 'w' pour write)
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)


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

class UserSchema(BaseModel):
    """
    Les attributs obligatoires
    """
    username : str
    email : str
    password : str
    langue : str

class PostSchema(BaseModel):
    """
    Les attributs obligatoires
    """
    id_post: Optional[int] = None
    id_user: int
    date: str
    type: str
    afficher: bool
    """
    Les attributs facultatifs
    """
    text: str = ""
    id_note: int = None
    id_post_comm: int = None


"""
Api pour user
"""

from .db_mapping import User, Collection, PossedeRole, Post

def find_user(username:str, session:Session):
    order = select(User).where(User.username == username)
    result = session.execute(order)
    found_user = result.scalar()
    return(found_user)

def check_user(password:str, username:str, session:Session):
    order = select(User).where(User.username == username)
    result = session.execute(order).scalar()
    
    encoded_password = password.encode('utf-8')
    stored_password = result.password.encode('utf-8')
    
    if bcrypt.checkpw(encoded_password, stored_password):
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
            logging.debug(f"voici l'user qui rentre {user}")
            user_salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), user_salt)
            new_user = User(
                username = user.username,
                email = user.email,
                password = hashed_password.decode('utf-8'),
                salt = user_salt.decode('utf-8'),
                langue = user.langue,
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            
            user_id = session.query(User).filter_by(username=user.username).first().id_user
            
            new_collection = Collection(
                id_creator = user_id,
                nom = 'all saves',
                is_all_saves = True
            )
            
            new_role = PossedeRole(
                nom_role = 'user',
                id_user = user_id
            )
            
            session.add(new_collection)
            session.commit()
            session.refresh(new_collection)
            
            session.add(new_role)
            session.commit()
            session.refresh(new_role)
            return new_user


@app.post("/login_check")
def log_user(user : UserSchema):
    error = False
    with Session(db.engine) as session:
        found_user = find_user(user.username, session)
        if found_user == None:
            error = True
        elif not check_user(user.password,user.username,session):
            error = True
        if error:
            return {'message': 'Wrong username or password'}
        else:
            return {'message': 'success','user' : user}
        
"""
Api pour post
"""

def find_post(id_post: int, session:Session):
    order = select(Post).where(Post.id_post == id_post)
    result = session.execute(order)
    found_post = result.scalar()
    return(found_post)


@app.get("/posts")
def get_posts():
    with Session(db.engine) as session:
        posts = session.query(Post).all()
        return posts


@app.get("/posts/{id_post}")
def get_post(id_post: int):
    error = False
    with Session(db.engine) as session:
        post = find_post(id_post=id_post, session=session)
        if post == None:
            error = True
        if error:
            return {'message': 'Post not found'}
        else:
            return post


@app.post("/posts")
def add_post(post: PostSchema):
    with Session(db.engine) as session:
        new_post = Post(
            text = post.text,
            id_user = post.id_user,
            date = post.date,
            type = post.type,
            afficher = post.afficher,
            id_note = post.id_note,
            id_post_comm = post.id_post_comm,
        )
        session.add(new_post)
        session.commit()
        session.refresh(new_post)
        return new_post


@app.put("/posts/{id_post}")
def put_post(id_post: int, post: PostSchema):
    with Session(db.engine) as session:
        stm = select(Post).where(
            Post.id_post == id_post
        )
        res = session.execute(stm)
        found_post = res.scalar()
        if found_post is None:
            raise HTTPException(status_code=404, detail="Post not found")
        found_post.text = post.text
        session.commit()
        session.refresh(found_post)
        return found_post


@app.delete("/posts/{id_post}")
def delete_post(id_post: int):
    with Session(db.engine) as session:
        stm = select(Post).where(
            Post.id_post == id_post
        )
        res = session.execute(stm)
        found_post = res.scalar()
        if found_post is not None:
            session.delete(found_post)
            session.commit()
        else:
            raise HTTPException(404, "Post not found")

#ajouter une api pour récupérer les commentaires d'un post

            
if __name__ == "__main__":
    print(add_user(
        UserSchema(username = "michel33", role = "",date_de_naissance = "2001-04-02",
        email = "ghfdjx", password = "hgfjd", langue = "fr", nom = "Michel")
    ))
    print(get_user("michel33"))
    # prenom: str = ""
    # genre: str = ""
    # adresse: str = ""
    # description: str = ""