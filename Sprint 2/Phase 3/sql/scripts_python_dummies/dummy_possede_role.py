import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_role import noms as role

fake = faker.Faker(["fr_FR"])

#creation of useful data
chemin="Sprint 2/Phase 3/sql/bases_sql/"
historique=[]


TABLE_NAME = "possede_role";
TABLE_COLUMNS = ['id_user','nom_role']
content = "";


for i in range(1,nb_user+1):
    role_user=random.choices(role,weights=[0.90,0.1])[0]
    historique.append([i,role_user])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{i}\',\'{role_user}\');\n"

for _ in range(nb_user//10):
   user=random.randint(1,nb_user)
   role_user=random.choice(role)
   while [user,role_user] in historique:
       user=random.randint(1,nb_user)
       role_user=random.choices(role,weights=[0.60,0.40])[0]
   historique.append([user,role_user]) 
   content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES (\'{user}\',\'{role_user}\');\n'

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)