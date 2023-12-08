import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_collection import DUMMY_DATA_NUMBER as nb_collection

fake = faker.Faker(["fr_FR"])

#creation of useful data
historique=[] 
chemin="Sprint 2/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "liked_collection";
TABLE_COLUMNS = ['id_user','id_collection']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_collection=random.randint(1,nb_collection)
    id_user=random.randint(1,nb_user)
    while [id_user,id_collection] in historique:
        id_post=random.randint(1,nb_collection)
        id_user=random.randint(1,nb_user)
    historique.append([id_user,id_collection])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_user}\',\'{id_collection}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)