from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from .db_mapping import DBAcces
import bcrypt
import logging
import base64
import os
from io import BytesIO
from PIL import Image
import re
# import cStringIO

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
    image_data: Optional[str] = None
    ppbin: Optional[str] = None
    ppform: Optional[str] = None

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

class UserUpdate(BaseModel):
    """
    Les attributs obligatoires
    """
    username : Optional[str]
    langue : str
    nom : Optional[str]
    prenom : Optional[str]
    date_de_naissance : Optional[str]
    genre : Optional[str]
    adresse : Optional[str]
    description : Optional[str]
    old_username : str
    ppbin: Optional[str] = None
    ppform: Optional[str] = None
    
class LikeSchema(BaseModel):
    """
    Les attributs obligatoires
    """
    id_post : int
    id_user : int


"""
Api pour user
"""

from .db_mapping import User, Collection, PossedeRole, Post, Abonnement, LikedPost

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
        if user:
            if user.ppbin:
                image_data2 = base64.b64encode(user.ppbin)
                image_data = image_data2.decode('utf-8')
                image = Image.open(BytesIO(base64.b64decode(image_data2)))
                image.save(os.path.join('../frontend/src/screens/Profile/assets', 'profile.png'))
            else:
                image_data = None
            user.ppbin = image_data
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
            with open('../frontend/public/user.png', 'rb') as image_file:
                base64_bytes = base64.b64encode(image_file.read())
                # img_bin = base64.b64decode(base64_bytes)
                img_bin = base64_bytes.decode('utf-8')
            image_data2 = re.sub('^data:image/.+;base64,', '', img_bin)
            image_data = base64.b64decode(image_data2)
            
            new_user = User(
                username = user.username,
                email = user.email,
                password = hashed_password.decode('utf-8'),
                salt = user_salt.decode('utf-8'),
                langue = user.langue,
                ppbin = image_data,
                ppform = "png",
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
            if found_user.ppbin:
                image_data2 = base64.b64encode(found_user.ppbin)
                image_data = image_data2.decode('utf-8')
                image = Image.open(BytesIO(base64.b64decode(image_data2)))
                image.save(os.path.join('../frontend/src/screens/Login/assets', 'user.png'))
            else:
                image_data = None
            found_user.ppbin = image_data
            return {'message': 'success','user' : found_user}
         
@app.put("/users")
def update_user(user : UserUpdate):
    error = False
    with Session(db.engine) as session:
        found_user = find_user(user.old_username, session)
        if found_user == None:
            error = True
        else:
            #TODO checker si les champs obligatoires ne sont pas vide
            other_username = find_user(user.username,session)
            if other_username == None or user.username == user.old_username:
                if user.ppbin:
                    image_data2 = re.sub('^data:image/.+;base64,', '', user.ppbin)
                    image_data = base64.b64decode(image_data2)
                    image = Image.open(BytesIO(base64.b64decode(image_data2)))
                    image.save(os.path.join('../frontend/src/screens/Login/assets', 'user.png'))
                else:
                    image_data = None
                order = update(User).where(User.username == user.old_username).values(
                    username = user.username,
                    langue = user.langue,
                    nom = user.nom,
                    prenom = user.prenom,
                    date_de_naissance = user.date_de_naissance,
                    genre = user.genre,
                    adresse = user.adresse,
                    description = user.description,
                    ppbin = image_data,
                    ppform = user.ppform
                )
                result = session.execute(order)
                session.commit()
            else:
                error = True
            
        if error:
            return {'message': 'User doesn\'t exist or username already used'}
        else:
            if found_user.ppbin:
                image_data = base64.b64encode(found_user.ppbin).decode('utf-8')
            else:
                image_data = None

            return {
                'message': 'success',
                'user': 
                    {**user.dict(),'image_data': image_data,}
            }
            
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
        
#api pour récupérer les commentaires d'un post
@app.get("/posts/{id_post}/comments")
def get_post_comments(id_post: int):
    with Session(db.engine) as session:
        comments = session.query(Post).where(Post.id_post_comm==id_post).all()
        return comments

#api pour récupérer le user d'un post, changer pour avec find_user_by_id
@app.get("/posts/{id_post}/user")
def get_user_from_post(id_post: int):
    with Session(db.engine) as session:
        post = session.query(Post).filter(Post.id_post==id_post).first()
        if post is not None:
            user = session.query(User).filter(User.id_user==post.id_user).first()
            return user
        else:
            return ["error : Post not found"]
        
"""
Api pour abonné/abonnement
"""    
@app.get("/community/{username}")
def get_community(username: str):
    liste_abonnement=[]
    liste_abonne=[]
    with Session(db.engine) as session:
        user = find_user(username=username, session=session)
        if user:
            id_user=user.id_user
            query_abonnement = select(Abonnement).where(Abonnement.id_user1 == id_user)
            query_abonne = select(Abonnement).where(Abonnement.id_user2 == id_user)
            res_abonnement = session.execute(query_abonnement).all()
            res_abonne = session.execute(query_abonne).all()
            for abonnement in res_abonnement:
                query_username=select(User.username).where(User.id_user == abonnement.Abonnement.id_user2)
                username=session.execute(query_username).scalar()
                liste_abonnement.append(username)
            for abonne in res_abonne:
                query_username=select(User.username).where(User.id_user == abonne.Abonnement.id_user1)
                username=session.execute(query_username).scalar()
                liste_abonne.append(username)
            nb_abonnement=session.query(query_abonnement.alias("subquery")).count()
            nb_abonne=session.query(query_abonne.alias("subquery")).count()
    return  {'nb_abonnement':nb_abonnement,'nb_abonne':nb_abonne,'liste_abonnement': liste_abonnement ,'liste_abonne': liste_abonne }



def find_sub(username1:str, username2:str, session:Session):
    user1 = find_user(username=username1, session=session)
    user2 = find_user(username=username2, session=session)
    if user1 and user2:
        id_user1=user1.id_user
        id_user2=user2.id_user
        order = select(Abonnement).where(Abonnement.id_user1 == id_user1, Abonnement.id_user2 == id_user2)
        result = session.execute(order)
        found_sub = result.scalar()
        if found_sub:
            return {'message':True,'sub':found_sub}
        else:
            return {'message': False,'id_user1':id_user1,'id_user2':id_user2}
    else:
        return {'message': False}


@app.get("/find_follow/{username1}/{username2}")
def find_follow(username1: str,username2:str):
    with Session(db.engine) as session:
        response=find_sub(username1,username2,session)
        return response['message']
        

@app.post("/handle_follow/{username1}/{username2}")
def handle_follow(username1: str,username2:str):
    with Session(db.engine) as session:
        response=find_sub(username1,username2,session)
        try:
            sub=response['sub']
            session.delete(sub)
            session.commit()
            return 'Follow erased'
        except:
            try:
                id_user1=response['id_user1']
                id_user2=response['id_user2']
                new_sub=Abonnement(
                    id_user1=id_user1,
                    id_user2=id_user2
                )
                session.add(new_sub)
                session.commit()
                session.refresh(new_sub)
                return 'Follow added'
            except:
                return 'User not found'

"""
Api pour les likes
""" 

@app.get("/likes")
def get_likes():
    with Session(db.engine) as session:
        stars = session.query(LikedPost).all()
        return stars


@app.post("/likes")
def add_like(like: LikeSchema):
    with Session(db.engine) as session:
        stars = get_likes()
        found_like = next(
            (
                s
                for s in stars
                if s.id_post == like.id_post and s.id_user == like.id_user
            ),
            None,
        )
        if found_like is None:
            new_like = LikedPost(
                id_post=like.id_post, id_user=like.id_user
            )
            session.add(new_like)
            session.commit()
    return like


#lui marche pas
@app.delete("/likes/{id_post}/{id_user}")
def delete_like(id_post: int, id_user: int):
    with Session(db.engine) as session:
        stm = select(LikedPost).where(
            LikedPost.id_post == id_post and LikedPost.id_user == id_user
        )
        res = session.execute(stm)
        found_like = res.scalar()
        if found_like is not None:
            session.delete(found_like)
            session.commit()
        else: 
            raise HTTPException(404, "Like not found")

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
 