import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_etablissement import DUMMY_DATA_NUMBER as nb_etablissement

fake = faker.Faker(["fr_FR"])

chemin="Sprint 1/Phase 3/sql/"

DUMMY_DATA_NUMBER = 50;
TABLE_NAME = "note";
TABLE_COLUMNS = ['id_etablissement','id_user']
content = "";

for _ in range(DUMMY_DATA_NUMBER):
    id_user=random.randint(1,nb_user)
    id_etablissement=random.randint(1,nb_etablissement)
    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{id_etablissement}","{id_user}");\n'


if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)