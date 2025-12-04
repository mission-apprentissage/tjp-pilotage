# Documentation du processus d'import

Le processus d'import sur Orion est complexe et découpé en plusieurs phases.

## Récupération des données et nettoyage

La majorité des données d'Orion sont extraites de fichiers csv. Ceux-ci sont stockés dans les sources du projet git dans server/static/files
Avant d'intégrer ces fichiers, ceux-ci sont récupérés depuis plusieurs sources puis formattés et nettoyés. Cette récupération est documentée par ailleurs.

Une fois les fichiers récupérés ils sont stockés directement dans les fichiers de l'application. Cela permet à la CLI d'import d'y avoir accès peu importe l'environnement (en local, en recette, en production).

Le format rigoureux de ces fichiers est primordial. Sans ça, l'import ne pourra pas fonctionner.
Les données extraites de ces fichiers sont typées fortement de façon à garantir que celles-ci correspondent à celles attendues par les scripts.

## Lancement des scripts d'import

Les scripts d'import sont tous lancés de la même manière sur les différents environnements :
``yarn cli <nomDuScript>``

Ces scripts sont consultables sur `server/src/commands.product.ts` et peuvent être lancés depuis `server` ou depuis la racine.

Pour une installation et un import classique ces imports doivent être lancés consécutivement et dans un ordre précis :

```bash
yarn cli importFiles
yarn cli importTables
yarn cli importIJ
yarn cli importFormations
yarn cli importPositionsQuadrant
```

Ces scripts peuvent également être lancés ponctuellement sur un seul usecase/fichier/table au besoin :

```bash
yarn cli importFiles lyceesACCE.csv
yarn cli importTables importLieuxGeographiques
```

## Détail des scripts d'import

### importFiles

Ce script permet de récupérer les données depuis les fichiers csv et de les stocker dans une table de cache `rawData`.
Chaque ligne de CSV est insérée dans la table `rawData` sous la forme (type (le nom du fichier), data (un jsonb contenant les données de la ligne sous forme de clé/valeur), id) de façon à être par la suite requêtée facilement.

_À noter : `importFiles` vide d'abord les valeurs dans `rawData` pour chaque CSV de façon à ce que les valeurs dans `rawData` reflète exactement les fichiers dans les sources._

### importTables

Ce script requête la table `rawData` et pour chaque ligne insère une ligne correspondante dans la bonne table pour peupler la base relationnelle.
Chaque table est peuplée consécutivement de façon à garantir la cohérence de la table (les clés étrangères notamment).

### importIJ

Ce script itère sur les données importées précédemment. En particulier sur les tables `region` (pour récupérer les données régionales, nous y viendrons) et sur les tables `diplomeProfessionnel`/`formationHistorique` et sur les constats de rentrée/offre en apprentissage (pour les données à l'échelle de l'établissement).
Le but de ces itérations est de récupérer, à différentes mailles (régionale / établissement), les formations dispensées et pour chacune d'appeler l'API IJ.

Ainsi, on parcourt la liste des diplômes professionnel et des formations historiques, les régions, les établissements et on récupère les données de sortie de formation (taux d'emploi, taux de poursuite, nombre d'élèves sortis...) depuis l'API Inserjeunes.

_À noter : ces données sont récupérées à chaque fois à l'échelle d'un millésime (une cohorte d'élèves correspondants à deux années de sortie d'élèves)._

Ces stockées, une fois récupérées depuis l'API sont, à leur tour, stockées dans la table `rawData` pour être utilisées par la suite.

### importFormation

Ce script va itérer successivement, d'une manière similaire à l'étape précédente, sur les régions/établissements/diplômes professionnels.
Le but est ici de peupler les tables restantes `formation`, `etablissement`, `formationEtablissement`, `indicateurSortie`, `indicateurRegionSortie`, `indicateurEntree`, `indicateurEtablissement`...
Ces tables sont interconnectées par des clés étrangères et sont donc peuplées par des itérations imbriquées.

_À noter : ces données sont récupérées à chaque fois à l'échelle d'un millésime (une cohorte d'élèves correspondants à deux années de sortie d'élèves) pour les données de sortie (nombre de sortants, taux d'emploi, de poursuite d'études) et à l'échelle d'une rentrée scolaire pour les données d'entrée (capacités, effectifs)._

Ces deux étapes sont les plus complexes et les plus longues (jusqu'à plusieurs heures).

### importPositionsQuadrant

Ce script va récupérer à partir des données de sortie existantes la valeur des indicateurs de sortie pour une formation donnée dans un établissement donné pour une année donnée et les stocker. Elle va également, en comparant ces valeurs à la valeur moyenne pour les formations dispensées dans la même région et avec le même niveau de diplome (BTS/Bac pro/CAP...), générer la position quadrant de l'offre de formation.


## Précisions sur les mécanismes

Les scripts d'import évoqués plus haut permettent de lancer des fonctions présentes dans ``server/src/modules/import/[usecase]``.
Ces fonctions sont découpées sous forme de usecases métiers qui ont leurs propres règles et leurs propres utilitaires.
Ces fonctions d'import utilisent parfois des services externes pour appeler des APIs.

Tous les fichiers CSV utilisés ont un format propre dont les propriétés sont décrites dans les fichiers présents dans ``server/src/modules/fileTypes``.

## Limites connues

- L'API inserjeunes est capricieuse. Sa (documentation)[https://www.inserjeunes.education.gouv.fr/api/docs/] est parfois floue et les performances de cette API le sont également.
Les appels en erreur ne sont pas toujours notifié au client (nous) ce qui ne permet pas de garantir à 100% que pour 2 appels identiques les données récupérées soient les même.
Le nombre d'appels en parallèles utilisés dans les scripts est normalement callibré de façon à maximiser la performance tout en couvrant le maximum de données. Plusieurs lancements sont parfois nécessaires pour garantir que toutes les données ont été récupérées.
- Les itérations successives sur les tables (notamment dans importFormations) rendent ce script complexe, sous-optimal et sous-performant.
- Pour considérer les données de nouvelles années/millésimes ces nouvelles valeurs doivent être rajoutées dans les fichiers `shared/time`
