# Lancer les APIs

## Description

Comment lancer le programme permettant l'utilisation des APIs du fichier app_api.

# Avant toute utilisation des APIs

- Bien verifier que la base de données PostgreSQL est en route.
- Si vous ne l'avez pas fait, veuillez suivre le README-BDD.md pour la création de la base de données et son peuplement.

## Si vous n'avez pas encore poetry 
Normalement vous avez déjà installé poetry précédement. Sinon :

https://python-poetry.org/docs/


## Lancement des  APIs

Placez-vous dans le dossier backend :

```bash
poetry install
poetry run app_backend
```

Vous pouvez maintenant vous rendre dans votre navigateur sur http://localhost:9456/docs pour vérifier que l'API fonctionne bien. Vous pouvez le vérifier en ajoutant un user et en faisant cette requête SQL dans votre base postgres : 

```sql
select * from "user" where id_user>300;
```

Une fois l'API utilisée, il devrait y avoir votre user ici.