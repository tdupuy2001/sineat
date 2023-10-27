import faker 
import random
from dummy_note import DUMMY_DATA_NUMBER as nb_note
from dummy_type_note import DATA_NUMBER as nb_type_note

fake = faker.Faker(["fr_FR"])

#creation of useful data
chemin="Sprint 1/Phase 3/sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "note_concerne";
TABLE_COLUMNS = ['id_note','id_type_note','grade']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_note=random.randint(1,nb_note)
    id_type_note=random.randint(1,nb_type_note)
    grade=random.randint(1,5)
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_note}\',\'{id_type_note}\',\'{grade}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)