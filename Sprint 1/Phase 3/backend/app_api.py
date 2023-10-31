from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from db_mapping import DBAcces
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
Api pour user
"""

from db_mapping import User

def find_user(username:str, session:Session):
    order = select(User).where(User.username == username)
    result = session.execute(order)
    found_user = result.scalar()
    return(found_user)


app.post("/register")
def add_user(user: User):
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

        
        
if __name__=="__main__":
    session = Session(db.engine)
    print(find_user(username="RGuillou",session=session),find_user(username="AGoeury",session=session))
    
    test_user = User(
            username="test_user",
            date_de_naissance="1990-01-01",
            email="test@example.com",
            password="test_password",
            langue="fr"
        )
    
    add_user(test_user)
    
    print(find_user(username="test_user",session=session))