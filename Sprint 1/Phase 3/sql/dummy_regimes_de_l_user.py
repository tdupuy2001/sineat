import faker 
import random
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_regime import DATA_NUMBER as nb_regime

fake = faker.Faker(["fr_FR"])

#creation of useful data
chemin="Sprint 1/Phase 3/sql/"
historique=[]

TABLE_NAME = "regimes_de_l_user";
TABLE_COLUMNS = ['id_user','id_regime']
content = "";

for i in range(1,nb_user+1):
    regime_user=random.randint(1,nb_regime)
    historique.append([i,regime_user])
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{i}\',\'{regime_user}\');\n"

#uncomment if we add another type of regime

#for _ in range(nb_user//4):
#    user=random.randint(1,nb_user)
#    regime_user=random.randint(1,nb_regime)
#    while [user,regime_user] in historique:
#        user=random.randint(1,nb_user)
#        regime_user=random.randint(1,nb_regime)
#    historique.append([i,regime_user]) 
#    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{user}","{regime_user}");\n'

if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)