import faker 
from utils import create_password,create_ppbin
import random

fake = faker.Faker(["fr_FR"])

#creation of useful data
roles=['admin','user']
genres=['homme','femme','']
langues= ["Mandarin", "Espagnol", "Anglais", "Hindi", "Arabe"]
ppforms=['JPG','PNG']
taille_binaire=50
chemin="Sprint 1/Phase 3/sql/"

#user creation
DUMMY_DATA_NUMBER = 300;
TABLE_NAME = "user";
TABLE_COLUMNS = ["username","role","nom","prenom","date_de_naissance","genre","email","adresse","password","ppbin","ppform","langue","description"]
content = "";

for _ in range(DUMMY_DATA_NUMBER):
    role=roles[random.randint(0,len(roles)-1)]
    prenom = fake.first_name()
    nom = fake.last_name()
    username=prenom[0]+nom
    date_de_naissance=fake.date_of_birth(minimum_age=10,maximum_age=90)
    genre=genres[random.randint(0,len(genres)-1)]
    email = fake.ascii_safe_email()
    adresse=str(random.randint(1,99))+' '+fake.street_name()+','+fake.city()
    password=create_password(random.randint(8,16))
    langue=langues[random.randint(0,len(langues)-1)]
    ppform=ppforms[random.randint(0,len(ppforms)-1)]
    ppbin=create_ppbin(taille_binaire)
    description=fake.paragraph(nb_sentences=3, variable_nb_sentences=False)
    content += f'INSERT INTO {TABLE_NAME} ({",".join(TABLE_COLUMNS)}) VALUES ("{username}","{role}","{nom}","{prenom}","{date_de_naissance}","{genre}","{email}","{adresse}","{password}","{ppbin}","{ppform}","{langue}","{description}");\n'


if __name__=="__main__":
    with open(chemin+f"dummy_{TABLE_NAME}.sql", 'w') as f:
        f.write(content)