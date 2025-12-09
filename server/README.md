# Ordre de l'import des données

## `yarn cli importFiles`
Cette commande importe les fichiers CSV vers la table cache `rawData`. Cela implique que les fichiers sont formatés comme il faut :
- encodés en **utf8**
- séparés par des **points-virgules**
- **sans des champs commentaires** qui contiennent potentiellement des points-virgules
- avec les bons **champs d'intérêts** (cf les fichiers dans `server/src/modules/import/fileTypes\`), sans wrap de guillemets
- placés au **bon endroit dans l'arbordescence des fichiers csv** (`server/static/files`)
- nommés comme il faut (majuscules, minuscules, tirets)

## `yarn cli importTables`
Cette commande importe les données depuis la table cache `rawData` vers les tables de la base de données. Voici les tables alimentées :
- `diplomeProfessionnel`
- `familleMetier`
- `dataFormation`
- `dataEtablissement`
- `niveauDiplome`
- `dispositif`
- `nsf`
- `actionPrioritaire`
- `departement`
- `academie`
- `region`
- `indicateurRegion`
- `indicateurDepartement`
- `discipline`
- `constatRentree`

Si besoin d'importer qu'une seule table, on peut exécuter la commande `yarn cli importTables <nomTable>`.   
C'est le cas par exemple pour l'import des **nouvelles formations** (`yarn cli importTables dataFormation`) ou des **nouveaux établissements** (`yarn cli importTables dataEtablissement`) en début de nouvelle campagne de saisie du formulaire.


## `yarn cli importIJ`
Cette commande appelle l'API inserjeunes et stocke les données réarrangées dans `rawData`. Il y a 2 types de données IJ récupérées :
- `ij` pour la maille formation x établissement
- `ij_reg` pour la maille formation x région
Cette commande peut prendre **plusieurs heures** à être exécutée.


## `yarn cli importFormations`
Cette commande est le coeur de l'import de toutes les autres tables d'analyses d'Orion. Elle itère sur la table `diplomeProfessionnel` (liste de cfd) pour les voies scolaire et apprentissage, et stocke pour chaque formation :
- les établissements qui l'enseignent dans la table `etablissement` : adresse, département, académie, région, latitude et longitude
- les **offres de formations** associées (cfd x uai), toutes rentrées scolaires confondues dans la table `formationEtablissement`
- les indicateurs d'entrée de chaque **offre de formation** (cfd x uai) dans la table `indicateurEntree` pour **chaque rentrée scolaire**: capacités, voeux et effectifs
- les indicateurs inserjeunes de chaque **offre de formation** (cfd x uai) dans la table `indicateurSortie` pour **chaque millésime**: effectifs en année terminale, nombre de poursuivants, nombre de personnes en emploi sous 6-12-18 mois, nombre de sortants
- les indicateurs inserjeunes de chaque **formation régionale** (cfd x code région) dans la table `indicateurRegionSortie` pour **chaque millésime**: effectifs en année terminale, nombre de poursuivants, nombre de personnes en emploi sous 6-12-18 mois, nombre de sortants
- la valeur ajoutée de chaque établissement pour **chaque millésime**

## `yarn cli importPositionsQuadrant`
Cette commande permet de calculer les positions quadrant d'une formation régionale (cfd x code région) lors de la sortie d'un nouveau millésime. Il alimente les tables suivantes, qui facilitent les requêtes au sein des écrans de l'application :
- `tauxIJNiveauDiplomeRegion`
- `positionFormationRegionaleQuadrant`

## `yarn cli importMetierTension` (optionnel)
Cette commande n'est à exécuter que **si les données suivantes en lien avec les métiers** sont à importer :
- le **lien métier-formation** via certif-info
- les **tensions des métiers** (déjà importées sous forme de fichiers csv via l'API France Travail) :
    - à l'échelle **nationale**
    - à l'échelle **régionale**
    - à l'échelle **départementale**
Les tables concernées sont :
- `domaineProfessionnel`
- `rome`
- `metier`
- `formationRome`
- `tension`
- `tensionRome`
- `tensionRomeRegion`
- `tensionRomeDepartement`
