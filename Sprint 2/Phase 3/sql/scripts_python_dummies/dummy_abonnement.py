import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user

fake = faker.Faker(["fr_FR"])

#creation of useful data
historique=[]
chemin="Sprint 2/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "abonnement";
TABLE_COLUMNS = ['id_user1','id_user2']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_user1=random.randint(1,nb_user)
    id_user2=random.randint(1,nb_user)
    while id_user1==id_user2 or [id_user1,id_user2] in historique:
        id_user1=random.randint(1,nb_user)
        id_user2=random.randint(1,nb_user)
    historique.append([id_user1,id_user2])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_user1}\',\'{id_user2}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)