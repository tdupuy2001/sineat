import faker 
import random

fake = faker.Faker(["fr_FR"])

chemin="Sprint 1/Phase 3/sql/"

DUMMY_DATA_NUMBER = 100
TABLE_NAME = "\"collection\""
TABLE_COLUMNS = ['nom','"public"']
content = ""

for i in range(DUMMY_DATA_NUMBER):
    nom=fake.word()
    public=random.choice(["true","false"])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{nom}\',{public});\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)