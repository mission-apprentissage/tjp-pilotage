# Variables à modifier pour l'import d'une nouvelle rentrée scolaire (RS) et d'un nouveau millésime IJ
Dans ce qui va suivre, la nouvelle **rentrée scolaire vaut 2025** et le nouveau **millésime vaut 2023_2024**. Il faudra donc adapter les temporalités au fil des années.

- Modifier le fichier `shared/time/CURRENT_RENTREE.ts` : mettre la valeur à **"2025"**
- Modifier le fichier `shared/time/millesimes.ts` : 
    - rajouter **"2023_2024"** à la variable `MILLESIMES_IJ`
    - rajouter **"2023_2024"** à la variable `MILLESIMES_IJ_REG`
    - rajouter **"2023_2024"** à la variable `MILLESIMES_IJ_REG`
    - rajouter **"2025"** à la variable `RENTREES_SCOLAIRES`
- Modifier le fichier `shared/time/CURRENT_IJ_MILLESIME.ts`: mettre la valeur à **"2023_2024"** 
- Modifier le fichier `server/src/commands.product.ts` : mettre la nouvelle rentrée scolaire **"2025"** parmi les years dans la variable `actions` :
    - `years` de l'import de `attractivite_capacite`
    - `years` de l'import de `BTS_attractivite_capacite`
    - `years` de l'import de `constat`

# Ordre de l'import des données

## `yarn cli importFiles`
Cette commande importe les fichiers CSV vers la table cache `rawData`. Cela implique que les fichiers sont formatés comme il faut :
- encodés en **utf8**
- séparés par des **points-virgules**
- **sans des champs commentaires** qui contiennent potentiellement des **points-virgules** ou des **sauts de lignes**
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
Cette commande est le coeur de l'import de toutes les autres tables d'analyses d'Orion. Elle itère sur la table `diplomeProfessionnel` (liste de cfd) pour les voies scolaire et apprentissage, et en partant des données en cache dans `rawData`, elle stocke pour chaque formation :
- les établissements qui l'enseignent dans la table `etablissement` : libellé, secteur (public ou privé), adresse, département, académie, région, latitude et longitude
- les **offres de formations** associées (cfd x uai), toutes rentrées scolaires confondues dans la table `formationEtablissement`
- les indicateurs d'entrée de chaque **offre de formation** (cfd x uai) dans la table `indicateurEntree` pour **chaque rentrée scolaire**: capacités, voeux et effectifs
- les indicateurs inserjeunes de chaque **offre de formation** (cfd x uai) dans la table `indicateurSortie` pour **chaque millésime**: effectifs en année terminale, nombre de poursuivants, nombre de personnes en emploi sous 6-12-18 mois, nombre de sortants
- les indicateurs inserjeunes de chaque **formation régionale** (cfd x code région) dans la table `indicateurRegionSortie` pour **chaque millésime**: effectifs en année terminale, nombre de poursuivants, nombre de personnes en emploi sous 6-12-18 mois, nombre de sortants
- la valeur ajoutée de chaque établissement pour **chaque millésime**

## `yarn cli importPositionsQuadrant`
Cette commande permet de calculer les positions quadrant d'une formation régionale (cfd x code région) lors de la sortie d'un nouveau millésime. Elle alimente les tables suivantes, ce qui facilite les requêtes au sein des écrans de l'application :
- `tauxIJNiveauDiplomeRegion`
- `positionFormationRegionaleQuadrant`

## `yarn cli importTensionFranceTravail <echelleOptionnelle>` (optionnel)
Cette commande permet de récupérer les données de tensions des métiers à différentes échelles, depuis l'API France Travail vers des fichiers CSV. Si `echelleOptionnelle` n'est pas donnée, la commande exécute dans cet ordre :
- à l'échelle **nationale** (`yarn cli importTensionFranceTravail importTensionFranceTravailNational`)
- à l'échelle **régionale** (`yarn cli importTensionFranceTravail importTensionFranceTravailRegion`)
- à l'échelle **départementale** (`yarn cli importTensionFranceTravail importTensionFranceTravailDepartement`)

Cela crée respectivement les fichiers CSV suivants :
- `server/static/files/tension_rome.csv`
- `server/static/files/tension_rome_region.csv`
- `server/static/files/tension_rome_departement.csv`


## `yarn cli importTensionRome <echelleOptionnelle>` (optionnel)
Cette commande n'est à exécuter que **si les données suivantes en lien avec les métiers** sont à importer :
- le **lien métier-formation** via certif-info
- les **tensions des métiers** (déjà importées en CSV depuis l'API France Travail par la commande précédente). Si `echelleOptionnelle` n'est pas donnée, la commande exécute dans cet ordre :
    - à l'échelle **nationale** (`yarn cli importTensionRome importTensionRomeNational`)
    - à l'échelle **régionale** (`yarn cli importTensionRome importTensionRomeRegion`)
    - à l'échelle **départementale** (`yarn cli importTensionRome importTensionRomeDepartement`)

Les tables concernées sont :
- `domaineProfessionnel`
- `rome`
- `metier`
- `formationRome`
- `tension`
- `tensionRome`
- `tensionRomeRegion`
- `tensionRomeDepartement`
