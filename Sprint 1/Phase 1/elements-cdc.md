# Conseils pour la rédaction du cahier des charges

* Se baser sur le plan général d'un cahier des charges... sans intégrer
  les parties inutiles ou hors-contexte (juridique, contractuelle,
  etc.)

* Ne pas mélanger l'exercice pédagogique et le projet. Le CdC doit être
  rédigé du point du vue de client. C'est lui qui décrit son besoin pour
  pouvoir faire un appel d'offres. L'équipe projet est dans un rôle
  d'AMOA (assistance à maîtrise d'ouvrage) qui aide le client à rédiger
  son CdC.

* Faire un ou plusieurs allers/retours entre l'équipe projet et le
  client pour valider/amender/améliorer/compléter le contenu du CdC.

* Le rédiger en terme "métier" (de la maîtrise d'ouvrage)

* Ne pas utiliser de formalisme particulier (pas d'UML, de Merise, de
  BPMN...) sauf si l'ensemble des acteurs de la MOA le connaisse et
  l'accepte ou le demande explicitement (très rare).

# Éléments qui devraient apparaître dans le CdC:

1. Les objectifs du système attendu

2. Le contexte organisationnel et les enjeux du système.

3. Un glossaire permettant de définir le sens de chaque terme métier et
   permettant de lever toute ambiguïté (vérifier que ces termes sont
   bien ceux utilisés tout au long du CdC).

4. Les acteurs du système (c.-à-d. ceux qui interagissent avec lui)
   qu'ils soient humains ou autres. Les regrouper et les nommer par
   rôle. Un même acteur peut avoir plusieurs rôles.

5. Des scénarios pour raconter l'usage du (futur) système par les
   acteurs mais en décrivant uniquement les fonctions sollicitées (en
   termes "métier") et non pas une éventuelle solution (syndrome XY).

   Essayer de couvrir tous les cas d'usage (nominaux mais aussi
   exceptionnels ou hors normes).

6. Identifier et nommer les classes d'_objets_ manipulés (ceux perçus
   par les acteurs). Identifier les informations qui permettent de les
   décrire.

7. Identifier et décrire (textuellement) l'ensemble des fonctions du
   (futur) système en les reliant aux scénarios. Indiquer quels rôles y
   ont accès.... sous quelles conditions. Décrire l'état du système
   avant et après l'application de cette fonction (les deux états
   doivent être cohérents). Décrire les informations nécessaires à cette
   fonction, leur provenance (qui les fournit) et les conditions
   qu'elles doivent remplir pour être acceptables.

   Identifier les dépendances entre fonctions.

   Étiqueter les fonctions selon le besoin (ex: indispensable, utile,
   accessoire). Éventuellement, décrire des variantes de la fonction qui
   pourrait changer son étiquetage.

8. Extraire des scénarios, de la description des objets et de la
   description des fonctions, les règles de gestion qui gèrent la
   cohérence de l'ensemble du système.

9. Lister et détailler toutes les contraintes s'appliquant au futur
   système (contraintes non-fonctionnelles). Elles peuvent être
   organisationnelles, juridiques, techniques...


