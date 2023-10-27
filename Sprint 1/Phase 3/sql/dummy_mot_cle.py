import faker 
import random

fake = faker.Faker(["fr_FR"])

chemin="Sprint 1/Phase 3/sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "mot_cle";
TABLE_COLUMNS = ['mot']
content = "";

for i in range(DUMMY_DATA_NUMBER):
    mot=fake.word()
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{mot}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)