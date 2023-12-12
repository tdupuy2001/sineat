import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user

fake = faker.Faker(["fr_FR"])

chemin="Sprint 2/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 100
TABLE_NAME = "\"collection\""
TABLE_COLUMNS = ['nom','id_creator','"public"','is_all_saves']
content = ""

for i in range(DUMMY_DATA_NUMBER):
    nom=fake.word().replace("'","")
    id_user = random.randint(1,nb_user)
    public=random.choice(["true","false"])
    is_all_saves=random.choice(["true","false"])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES ('{nom}','{id_user}','{public}','{is_all_saves}');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)