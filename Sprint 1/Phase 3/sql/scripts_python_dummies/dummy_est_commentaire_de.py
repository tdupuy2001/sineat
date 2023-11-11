import faker 
import random
from dummy_post import DUMMY_DATA_NUMBER as nb_post

fake = faker.Faker(["fr_FR"])

#creation of useful data
historique=[]
chemin="Sprint 1/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 50;
TABLE_NAME = "est_commentaire_de";
TABLE_COLUMNS = ['id_post1','id_post2']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_post1=random.randint(1,nb_post)
    id_post2=random.randint(1,nb_post)
    while id_post1==id_post2 or [id_post1,id_post2] in historique or [id_post2,id_post1] in historique:
        id_post1=random.randint(1,nb_post)
        id_post2=random.randint(1,nb_post)
    historique.append([id_post1,id_post2])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_post1}\',\'{id_post2}\');\n"


if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)