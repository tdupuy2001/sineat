import faker 

fake = faker.Faker(["fr_FR"])

#creation of useful data
noms=["restaurant","bar","magasin"]
chemin="Sprint 1/Phase 3/sql/"

DATA_NUMBER = len(noms);
TABLE_NAME = "type_etablissement";
TABLE_COLUMNS = ['nom']
content = "";

for i in range(DATA_NUMBER):
    nom=noms[i]
    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{nom}");\n'

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)