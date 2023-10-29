#Déjà créé donc pas à relancer.

sql_files=['dummy_"user".sql',
           'dummy_abonnement.sql',
           'dummy_"collection".sql',
           'dummy_etablissement.sql',
           'dummy_note.sql',
           'dummy_post.sql',
           'dummy_enregistrement_post.sql',
           'dummy_contenu_collection.sql',
           'dummy_est_commentaire_de.sql',
           'dummy_type_etablissement.sql',
           'dummy_etablissement_de_type.sql',
           'dummy_liked_collection.sql',
           'dummy_liked_post.sql',
           'dummy_mot_cle.sql',
           'dummy_mot_cle_post.sql',
           'dummy_type_note.sql',
           'dummy_note_concerne.sql',
           'dummy_regime.sql',
           'dummy_regime_etablissement.sql',
           'dummy_regimes_de_l_user.sql']

chemin_vers_bases="Sprint 1/Phase 3/sql/bases_sql/"
chemin_vers_scripts="Sprint 1/Phase 3/sql/scripts_python_dummies"
destination = "Sprint 1/Phase 3/sql/"

import os
import subprocess


for file_name in os.listdir(chemin_vers_scripts):
    if file_name.endswith(".py"):  # Vérifie si le fichier est un script Python
        if file_name != "utils.py":
            file_path = os.path.join(chemin_vers_scripts, file_name)
            subprocess.run(["python", file_path])  # Exécute le script Python

with open(destination+'merge.sql',"w") as f:
    for sql_file in sql_files:
        with open(chemin_vers_bases+f'{sql_file}',"r") as g:
            a=g.read()
            f.write(a)
            f.write('\n')