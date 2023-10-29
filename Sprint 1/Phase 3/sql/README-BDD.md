# Lancer la base de données pour le projet SINEAT

## Description
Ce projet vise à créer une application de gestion de base de données avec Postgres pour l'entreprise Sineat.

## Installation
1. Assurez-vous d'avoir PostgreSQL installé localement.
2. Exécutez les commandes suivantes dans votre terminal pour configurer la base de données :

Dans votre terminal rendez vous sur votre postgres en tant qu'utilisateur postgres. 
Sur mac :

```bash
psql postgres
```

Le prefixe du terminal doit être : 

```bash
postgres#= 
```

Vous pouvez alors créer :
- User avec son MdP et ses droits
- La base de données en donnant les privilèges à votre use


```sql
create user sineat_admin with password 'sineat_admin_password';
create database sineat_db owner sineat_admin;
revoke all on database sineat_db from public;
```
---
Il faudra peut être rajouter 
```sql
create database sineat_db owner sineat_admin
```
---
Vous pouvez vérifier que l'user et la base ont bien été crés avec : 

```sql
\du
\l
```
Sortez de postgres grâce à la commande :

```sql
\q
```

Vous pouvez bien évidemment faire avec les urls vu en cours. Mais elles ne fonctionnent pas sur mac et c'est pourquoi je note la démarche ici.

3. Connectez-vous à la base de données en utilisant la commande suivante :

```bash
psql -d sineat_db -U sineat_admin -W
```

4. Une fois connecté, importez le fichier SQL en exécutant la commande suivante, en remplaçant 'chemin/du/fichier/bdd.sql' par le chemin réel vers votre fichier SQL :

```sql
\i 'chemin/du/fichier/bdd.sql'
```

N'oubliez pas les apostrophes obligatoire car il y a des espaces dans les noms de dossiers.

5. Pour peupler la base il suffit d'exécuter de la même manière que précédement le fichier merge.sql : 

```sql
\i 'chemin/du/fichier/merge.sql'
```

