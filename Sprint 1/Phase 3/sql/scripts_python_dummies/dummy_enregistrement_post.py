import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_post import DUMMY_DATA_NUMBER as nb_post
from dummy_collection import DUMMY_DATA_NUMBER as nb_collection

fake = faker.Faker(["fr_FR"])

#creation of useful data
historique=[]
chemin="Sprint 1/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "enregistrement_post";
TABLE_COLUMNS = ['id_user','id_post']
TABLE_NAME_2 = "contenu_collection";
TABLE_COLUMNS_2 = ['id_user','id_post','id_collection']
content = "";
content_2 = "";

for i in range(DUMMY_DATA_NUMBER):
    id_post=random.randint(1,nb_post)
    id_user=random.randint(1,nb_user)
    id_collection=random.randint(1,nb_collection)
    while [id_post,id_user] in historique:
        id_post=random.randint(1,nb_post)
        id_user=random.randint(1,nb_user)
    historique.append([id_post,id_user])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_user}\',\'{id_post}\');\n"
    content_2 += f"INSERT INTO {TABLE_NAME_2} ({','.join(TABLE_COLUMNS_2)}) VALUES (\'{id_user}\',\'{id_post}\',\'{id_collection}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)
    with open(chemin+f"dummy_{TABLE_NAME_2}.sql", 'w') as f:
        f.write(content_2)