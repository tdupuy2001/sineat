import faker 
import random
from dummy_mot_cle import DUMMY_DATA_NUMBER as nb_mot_cle
from dummy_post import DUMMY_DATA_NUMBER as nb_post

fake = faker.Faker(["fr_FR"])

#creation of useful data
chemin="Sprint 1/Phase 3/sql/"
historique=[]

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "mot_cle_post";
TABLE_COLUMNS = ['id_mot_cle','id_post']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_post=random.randint(1,nb_post)
    id_mot_cle=random.randint(1,nb_mot_cle)
    while [id_mot_cle,id_post] in historique:
        id_post=random.randint(1,nb_post)
        id_mot_cle=random.randint(1,nb_mot_cle)
    historique.append([id_mot_cle,id_post])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_mot_cle}\',\'{id_post}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)