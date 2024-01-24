from typing import Optional
from fastapi import APIRouter, FastAPI, HTTPException ,Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from sqlalchemy import and_
from sqlalchemy import func
from typing import List
import httpx
from .db_mapping import DBAcces
import bcrypt
import logging
import base64
import os
from io import BytesIO
from PIL import Image
import re

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
    id_user: int
    type: str
    afficher: bool
    """
    Les attributs facultatifs
    """
    titre_post: Optional[str] = None
    id_post: Optional[int] = None
    text: Optional[str] = None
    id_note: Optional[int] = None
    id_post_comm: Optional[int] = None
    picbin: Optional[str] = None
    picform: Optional[str] = None


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

class Place(BaseModel):
    code_postal: int
    ville: str
    rue: str
    numero_rue: int
    nom: str
    type: str
    regime: str

"""
Api pour user
"""

from .db_mapping import User, Collection, PossedeRole, Post, Abonnement, LikedPost,Etablissement,Note,NoteConcerne,TypeNote,Regime, EtablissementDeType, TypeEtablissement, RegimeEtablissement,PhotoPost

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

#changer ici pour qu'ils remarchent
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
            else:
                image_data = None
            user.ppbin = image_data
            
            main_post_ids = find_main_posts_by_user(user.id_user)
            # main_post_ids = [1,2]
            
            
            return {
                    "user": user,
                    "main_post_ids": main_post_ids
                }
        else:
            return {"user":user}
    
def find_main_posts_by_user(user_id: int):
    with Session(db.engine) as session:
        main_posts = session.query(Post).filter(
            Post.id_user == user_id
        ).all()
        return [post.id_post for post in main_posts]



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
        posts_dict=[]
        posts = session.query(Post).all()
        for post in posts:
            post_dict=post.__dict__
            if post.id_photo:
                query=select(PhotoPost.picbin).where(PhotoPost.id_photo==post.id_photo)
                picbin=session.execute(query).scalar()
                picbin = base64.b64encode(picbin).decode('utf-8')
                post_dict['picbin']=picbin
            posts_dict.append(post_dict)
        return posts_dict
            


@app.get("/posts/{id_post}")
def get_post(id_post: int):
    error = False
    with Session(db.engine) as session:
        post = find_post(id_post=id_post, session=session)
        post_dict=post.__dict__
        if post == None:
            error = True
        if error:
            return {'message': 'Post not found'}
        else:
            if post.id_photo:
                query=select(PhotoPost.picbin).where(PhotoPost.id_photo==post.id_photo)
                result=session.execute(query)
                picbin=result.scalar()
                picbin = base64.b64encode(picbin).decode('utf-8')
                post_dict['picbin']=picbin
            return post_dict


@app.post("/posts")
def add_post(post: PostSchema):
    with Session(db.engine) as session:
        if post.picbin:
            image_data = base64.b64decode(post.picbin)
            new_photo_post=PhotoPost(
                picbin=image_data,
                picform=post.picform,  
            )
            session.add(new_photo_post)
            session.commit()
            session.refresh(new_photo_post)
            id_photo=new_photo_post.id_photo
            new_post = Post(
                text = post.text,
                id_user = post.id_user,
                afficher=post.afficher,
                type = post.type,
                titre_post = post.titre_post,
                id_note = post.id_note,
                id_post_comm = post.id_post_comm,
                id_photo = id_photo,
            )
            session.add(new_post)
            session.commit()
            session.refresh(new_post)
        else:
            new_post = Post(
                text = post.text,
                id_user = post.id_user,
                afficher=post.afficher,
                type = post.type,
                titre_post = post.titre_post,
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
            if user is not None:
                return {"username":user.username, "id_user":user.id_user}
            else:
                return ['error: User not found']
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

@app.get("/likes/{id_post}")
def get_likes_for_post(id_post:int):
    with Session(db.engine) as session:
        likes = session.query(LikedPost).filter(LikedPost.id_post == id_post).all()
        return likes


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


@app.delete("/likes/{id_post}/{id_user}")
def delete_like(id_post: int, id_user: int):
    with Session(db.engine) as session:
        stm = select(LikedPost).where(
            and_(LikedPost.id_post == id_post, LikedPost.id_user == id_user)
        )
        res = session.execute(stm)
        found_like = res.scalar()
        if found_like is not None:
            session.delete(found_like)
            session.commit()
        else: 
            raise HTTPException(404, "Like not found")
        
@app.get("/etablissements/by_regime")
def get_etablissements_by_regime(regime_id: int):
    with Session(db.engine) as session:
        etablissements = session.query(Etablissement).join(
            RegimeEtablissement, Etablissement.id_etablissement == RegimeEtablissement.id_etablissement
        ).filter(
            RegimeEtablissement.id_regime == regime_id
        ).all()
        return etablissements

@app.get("/etablissement")
def get_etablissement(nom: str = Query(None) ):
    etab_lines = []
    with Session(db.engine) as session:
        query = session.query(Etablissement)
        if nom:
            query = query.filter(Etablissement.nom == nom)

        etabs = query.all()

    return etabs

class RatingSchema(BaseModel):
    id_user: int
    id_etablissement: int
    rating1: float  # First rating value
    rating2: float  # Second rating value

@app.post("/addRatings")
async def add_ratings(rating_data: RatingSchema):
    with Session(db.engine) as session:
        # Create and save the Note instance
        new_note = Note(
            id_etablissement=rating_data.id_etablissement,
            id_user=rating_data.id_user
        )
        session.add(new_note)
        session.commit()
        session.refresh(new_note)

        # Assuming you have a method to determine the type IDs for rating1 and rating2
        id_type_note1 = 1  # You need to implement this
        id_type_note2 = 2  # You need to implement this

        # Create and save the NoteConcerne instances
        new_note_concerne1 = NoteConcerne(
            id_note=new_note.id_note,
            id_type_note=id_type_note1,
            grade=rating_data.rating1
        )
        new_note_concerne2 = NoteConcerne(
            id_note=new_note.id_note,
            id_type_note=id_type_note2,
            grade=rating_data.rating2
        )

        session.add_all([new_note_concerne1, new_note_concerne2])
        session.commit()

        return {"message": "Ratings added successfully"}


@app.get("/etablissement/notes")
def get_etablissement_notes(nom: str = Query(None)):
    with Session(db.engine) as session:
        query = session.query(Etablissement)
        if nom:
            query = query.filter(Etablissement.nom == nom)

        etabs = query.all()
        etab_notes = []

        for etab in etabs:
            notes_query = session.query(
                TypeNote.nom.label("note_type"),
                func.avg(NoteConcerne.grade).label("average_grade")
            ).join(NoteConcerne, TypeNote.id_type_note == NoteConcerne.id_type_note
            ).join(Note, NoteConcerne.id_note == Note.id_note
            ).filter(Note.id_etablissement == etab.id_etablissement
            ).group_by(TypeNote.nom)

            notes = notes_query.all()

            # Calculate global average if there are note types
            global_average = sum([note.average_grade for note in notes]) / len(notes) if notes else None

            notes_data = [{
                "note_type": note.note_type,
                "average_grade": float(note.average_grade)
            } for note in notes]

            etab_notes.append({
                "etablissement_name": etab.nom,
                "notes": notes_data,
                "global_average": global_average
            })

        return etab_notes


@app.get("/regimes")
def get_all_regimes():
    with Session(db.engine) as session:
        regimes = session.query(Regime).all()
        return regimes


class EtablissementAverageGrade(BaseModel):
    nom: str
    average_grade: float

@app.get("/note", response_model=EtablissementAverageGrade)
def get_note_etablissement(nom: str = Query(...)):  # Using ellipsis to make the parameter required
    with Session(db.engine) as session:
        query = session.query(
            Etablissement.nom,
            func.avg(NoteConcerne.grade).label('average_grade')
        ).join(Note, Etablissement.id_etablissement == Note.id_etablissement
        ).join(NoteConcerne, Note.id_note == NoteConcerne.id_note
        ).filter(Etablissement.nom == nom
        ).group_by(Etablissement.nom)

        etab_with_avg_grade = query.first()  # Get the first result

        # If no result found, return nom with average grade 0
        result = {"nom": nom, "average_grade": 0} if etab_with_avg_grade is None else \
                 {"nom": etab_with_avg_grade.nom, "average_grade": etab_with_avg_grade.average_grade}

    return result

@app.get("/coord")
async def get_coord(address: str):
    url = "https://api-adresse.data.gouv.fr/search/"
    params = {
        "q": address,
        "type": "housenumber",
        "autocomplete": "0"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()
        
@app.get("/filter_Byradius")
async def filter_addresses(
    lat : float,
    long : float,
    radius: float,
):
    # Define a function to calculate the distance between two sets of coordinates (latitude and longitude)
    def calculate_distance(lat1, lon1, lat2, lon2):
        import math

        # Radius of the Earth in kilometers
        radius_earth = 6371

        # Convert degrees to radians
        lat1 = math.radians(lat1)
        lon1 = math.radians(lon1)
        lat2 = math.radians(lat2)
        lon2 = math.radians(lon2)

        # Haversine formula to calculate distance
        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = radius_earth * c

        return distance


    if lat and long:

            # Fetch all addresses from the database
            matching_etabs = []
            with Session(db.engine) as session:
                etabs = session.query(Etablissement).all()
                for etab in etabs:
                    # Construct the address string
                    etab_address = f"{etab.numero_rue} {etab.rue} {etab.code_postal} {etab.ville}"

                    # Fetch coordinates of the etablissement address
                    url = "https://api-adresse.data.gouv.fr/search/"
                    params = {
                        "q": etab_address,
                        "type": "housenumber",
                        "autocomplete": "1"
                    }

                    async with httpx.AsyncClient() as client:
                        response = await client.get(url, params=params)
                        data = response.json()

                        if "features" in data and len(data["features"]) > 0:
                            # Extract latitude and longitude of the address
                            etab_lat = data["features"][0]["geometry"]["coordinates"][1]
                            etab_lon = data["features"][0]["geometry"]["coordinates"][0]

                            # Calculate the distance
                            distance = calculate_distance(etab_lat, etab_lon, lat, long)

                            # Check if the address is within the specified radius
                            if distance <= radius:
                                matching_etabs.append(etab)

            return matching_etabs
    else:
            return {"message": "Address not found"}

        
def find_etablissement(rue:str,ville:str,code_postal:int,numero_rue:int, session:Session):
    order = select(Etablissement).where(Etablissement.rue == rue,Etablissement.ville == ville,Etablissement.code_postal == code_postal,Etablissement.numero_rue == numero_rue)
    result = session.execute(order)
    found_etablissement = result.scalar()
    return(found_etablissement)
        
@app.post("/places/")
def create_place(place: Place):
    with Session(db.engine) as session:
        place.rue=place.rue.lower()
        place.ville=place.ville.lower()
        found_etablissement=find_etablissement(place.rue,place.ville,place.code_postal,place.numero_rue,session)
        if found_etablissement:
            return ('Etablissement existe déjà')
        else:
            new_place_data = Etablissement(
                code_postal=place.code_postal,
                ville=place.ville,
                rue=place.rue,
                numero_rue=place.numero_rue,
                nom=place.nom,
            )
            session.add(new_place_data)
            session.commit()
            session.refresh(new_place_data)

            queries_type = select(TypeEtablissement.id_type_etablissement).where(TypeEtablissement.nom==place.type)
            result = session.execute(queries_type)
            id_type_etablissement = result.scalar()
            found_etablissement=find_etablissement(place.rue,place.ville,place.code_postal,place.numero_rue,session)
            id_etablissement=found_etablissement.id_etablissement

            new_place_data_type= EtablissementDeType(
                id_etablissement= id_etablissement,
                id_type_etablissement = id_type_etablissement
            )

            session.add(new_place_data_type)
            session.commit()
            session.refresh(new_place_data_type)

            queries_regime = select(Regime.id_regime).where(Regime.nom==place.regime)
            result = session.execute(queries_regime)
            id_regime = result.scalar()
            found_etablissement=find_etablissement(place.rue,place.ville,place.code_postal,place.numero_rue,session)
            id_etablissement=found_etablissement.id_etablissement

            new_place_data_regime= RegimeEtablissement(
                id_etablissement= id_etablissement,
                id_regime = id_regime
            )
            session.add(new_place_data_regime)
            session.commit()
            session.refresh(new_place_data_regime)
            return ('Etablissement ajouté')

@app.get("/types-etablissements")
def get_types_etablissements():
    with Session(db.engine) as session:
        query = select(TypeEtablissement.nom)
        types_etablissements = session.execute(query).scalars().all()
        return {"types_etablissements": types_etablissements}
    
@app.get("/regimes-etablissements")
def get_regimes_etablissements():
    with Session(db.engine) as session:
        query = select(Regime.nom)
        regimes_etablissements = session.execute(query).scalars().all()
        return {"regimes_etablissements": regimes_etablissements}





# if __name__ == "__main__":
#     print(add_user(
#         UserSchema(username = "michel33", role = "",date_de_naissance = "2001-04-02",
#         email = "ghfdjx", password = "hgfjd", langue = "fr", nom = "Michel")
#     ))
#     print(get_user("michel33"))
#     # prenom: str = ""
#     # genre: str = ""
#     # adresse: str = ""
#     # description: str = ""
 