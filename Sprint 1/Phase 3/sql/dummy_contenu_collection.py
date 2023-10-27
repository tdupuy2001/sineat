import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_post import DUMMY_DATA_NUMBER as nb_post
from dummy_collection import DUMMY_DATA_NUMBER as nb_collection

fake = faker.Faker(["fr_FR"])

#creation of useful data
historique=[]
chemin="Sprint 1/Phase 3/sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "contenu_collection";
TABLE_COLUMNS = ['id_user','id_post','id_collection']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_post=random.randint(1,nb_post)
    id_user=random.randint(1,nb_user)
    id_collection=random.randint(1,nb_collection)
    while [id_user,id_post,id_collection] in historique:
        id_post=random.randint(1,nb_post)
        id_user=random.randint(1,nb_user)
        id_collection=random.randint(1,nb_collection)
    historique.append([id_user,id_post,id_collection])
    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{id_user}","{id_post}","{id_collection}");\n'

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)