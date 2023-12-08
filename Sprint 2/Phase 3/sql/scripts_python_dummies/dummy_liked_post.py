import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_post import DUMMY_DATA_NUMBER as nb_post

fake = faker.Faker(["fr_FR"])

#creation of useful data
historique=[]
chemin="Sprint 2/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "liked_post";
TABLE_COLUMNS = ['id_post','id_user']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_post=random.randint(1,nb_post)
    id_user=random.randint(1,nb_user)
    while [id_post,id_user] in historique:
        id_post=random.randint(1,nb_post)
        id_user=random.randint(1,nb_user)
    historique.append([id_post,id_user])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_post}\',\'{id_user}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)