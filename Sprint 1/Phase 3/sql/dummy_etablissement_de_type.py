import faker 
import random
from dummy_etablissement import DUMMY_DATA_NUMBER as nb_etablissement
from dummy_type_etablissement import DATA_NUMBER as nb_type

fake = faker.Faker(["fr_FR"])

#creation of useful data
chemin="Sprint 1/Phase 3/sql/"
historique=[]

TABLE_NAME = "etablissement_de_type";
TABLE_COLUMNS = ['id_etablissement','id_type_etablissement']
content = "";

for i in range(1,nb_etablissement+1):
    type_etablissement=random.randint(1,nb_type)
    historique.append([i,type_etablissement])
    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{i}","{type_etablissement}");\n'

for _ in range(nb_etablissement//4):
    etablissement=random.randint(1,nb_etablissement)
    type_etablissement=random.randint(1,nb_type)
    while [etablissement,type_etablissement] in historique:
        etablissement=random.randint(1,nb_etablissement)
        type_etablissement=random.randint(1,nb_type)
    historique.append([i,type_etablissement]) 
    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{etablissement}","{type_etablissement}");\n'


if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)