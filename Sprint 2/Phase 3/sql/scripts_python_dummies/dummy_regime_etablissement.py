import faker 
import random
from dummy_regime import DATA_NUMBER as nb_regime
from utils import nb_etablissement

fake = faker.Faker(["fr_FR"])

#creation of useful data
chemin="Sprint 2/Phase 3/sql/bases_sql/"
historique=[]

TABLE_NAME = "regime_etablissement";
TABLE_COLUMNS = ['id_etablissement','id_regime']
content = "";

for i in range(1,nb_etablissement+1):
    regime_etablissement=random.randint(1,nb_regime)
    historique.append([i,regime_etablissement])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{i}\',\'{regime_etablissement}\');\n"

#uncomment if we add another type of regime

#for _ in range(nb_etablissement//4):
#    etablissement=random.randint(1,nb_etablissement)
#    regime_etablissement=random.randint(1,nb_regime)
#    while [etablissement,regime_etablissement] in historique:
#        etablissement=random.randint(1,nb_etablissement)
#        regime_etablissement=random.randint(1,nb_regime)
#    historique.append([etablissement,regime_etablissement]) 
#    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES (\'{etablissement}\',\'{regime_etablissement}\');\n'

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)