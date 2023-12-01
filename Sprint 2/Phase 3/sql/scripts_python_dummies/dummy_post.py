import faker 
import random
import datetime
from dummy_user import DUMMY_DATA_NUMBER as nb_user
from dummy_note import DUMMY_DATA_NUMBER as nb_note

fake = faker.Faker(["fr_FR"])

#creation of useful data
types=["commentaire","recette","post","commentaire_resto"]
chemin="Sprint 1/Phase 3/sql/bases_sql/"

DUMMY_DATA_NUMBER = 100;
TABLE_NAME = "post";
TABLE_COLUMNS = ["id_user","text","date","type","afficher","id_note","id_post_comm"]
content = "";

for i in range(DUMMY_DATA_NUMBER):
    id_user=random.randint(1,nb_user)
    id_note=random.randint(1,nb_note)
    text=fake.paragraph(nb_sentences=2, variable_nb_sentences=False).replace("'","")
    date=fake.date_between(datetime.date(2015, 9, 1), datetime.date(2023, 10, 27))
    type_=types[random.randint(0,len(types)-1)]
    if i != 0:
        id_post_comm = random.choice([random.randint(1,i),"null"])
    else:
        id_post_comm = "null"
    if type_ == "commentaire_resto":
        afficher=random.choice(["true","false"])
    else:
        afficher = "true"
    content += f"INSERT INTO {TABLE_NAME} ({','.join(TABLE_COLUMNS)}) VALUES (\'{id_user}\',\'{text}\',\'{date}\',\'{type_}\',{afficher},\'{id_note}\',{id_post_comm});\n"


with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
    f.write(content)