import faker 
import random

fake = faker.Faker(["fr_FR"])

#creation of useful data
prefixe_nom=['Café','Restaurant','Bistro','Grill']
chemin="Sprint 1/Phase 3/sql/"

DUMMY_DATA_NUMBER = 10;
TABLE_NAME = "etablissement";
TABLE_COLUMNS = ["adresse","nom","approuved","description"]
content = "";

for _ in range(DUMMY_DATA_NUMBER):
    adresse=fake.city()
    nom=prefixe_nom[random.randint(0,len(prefixe_nom)-1)]+' '+fake.company()
    approved=random.choice([True,False])
    description=fake.paragraph(nb_sentences=1, variable_nb_sentences=False)
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{adresse}\',\'{nom}\',\'{approved}\',\'{description}\');\n"

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)