# Développement

- [Développement](#développement)
  - [Organisation des dossiers](#organisation-des-dossiers)
  - [Opérations](#opérations)
    - [Installation et Mise à jour des dépendences](#installation-et-mise-à-jour-des-dépendences)
  - [Linter](#linter)
  - [Prettier](#prettier)
  - [Typescript](#typescript)
    - [Arrêt des services](#arrêt-des-services)
    - [Suppression des services](#suppression-des-services)
      - [Server CLI](#server-cli)
    - [Emails](#emails)
    - [Debugger sous VSCode](#debugger-sous-vscode)
      - [Server Inspect](#server-inspect)

## Pré-requis

[Suivre la documentation dédié](./pre-requesites.md)

## Démarrage

Avant de lancer l'application, assurez-vous d'installer toutes les dépendances nécessaires en exécutant la commande suivante :

```bash
yarn
yarn setup
```

Cette commande mettra à jour les dépendances du projet.

Le script vous demandera plusieurs fois la phrase secrète de votre clé GPG pour décrypter les variables d'environnement du vault.

Il est possible que vous rencontriez un problème avec le fichier `.infra/local/mongo_keyfile` lors du démarrage du container de `mongodb` (vous auriez des erreurs dans les logs du démarrage du container).

Si c'est le cas, vérifiez que les droits du ficher sont bien `440` pour MacOS et `400` pour Linux et que le fichier appartient à l'utilisateur lançant `docker`.

```bash
yarn seed
yarn dev
```

Vous pouvez maintenant accéder à l'application via l'URL [http://localhost:3000](http://localhost:3000)

Vous pouvez maintenant accéder à l'API via l'URL [http://localhost:5001](http://localhost:5000)

Vous pouvez maintenant accéder au SMTP via l'URL [http://localhost:8025](http://localhost:8025)

## Détails des commandes globales

Les principales opérations sont regroupées dans le `package.json`.

### Initialisation de l'environnment

```bash
  yarn setup
```

installation ou mise à jour de vos fichiers d'environnement de développement depuis le vault.yml (`server/.env` et `ui/.env`)

### Lancement de la stack compléte

Pour démarrer l'application en mode local, exécutez la commande suivante :

```bash
  yarn dev
```

Lance la stack local de développement (server, ui, services)

Cette commande démarre les containers définis dans le fichier `docker-compose.yml`.

### Server CLI

La `cli` du server s'éxécute sur le fichier compilé `server/dist/index.js` ainsi il est nécéssaire de:

- soit avoir la commande `dev` lancée pour watch les changements
- soit build avec la commande `build:dev` dans `/server`

Commandes:

- `yarn cli --help`: List l'ensemble des commandes disponibles
- `yarn cli seed`: Seed de la database
- `yarn cli migrations:status`: Vérification du status des migrations
- `yarn cli migrations:up`: Execution des migrations
- `yarn cli migrations:create`: Creation d'une nouvelle migration

### Lancement de l'application

```bash
  yarn workspace server dev
```

Lance le server en dev indépendamment de la stack

```bash
  yarn workspace ui dev
```

Lance l'ui en dev indépendamment de la stack

### Gestion des services docker

Lance les services docker en local

```bash
  yarn services:start
```

---

Stopper les services docker en local

```bash
  yarn services:stop
```

---

Supprimer les services docker en local

```bash
  yarn services:clean
```

### Hydratation du projet en local

```bash
  yarn seed <OPTIONAL:DB_URL>
```

Pour créer des jeux de test facilement il suffit de lancer les commandes suivante.
Applique la base de données seed sur la base de données cible (par défaut la base de données locale)

---

Mise à jour de la base de données seed depuis votre local

```bash
  yarn seed:update
```

### Deploiement depuis l'environnement local

Deploie l'application sur l'environnement cible

```bash
  yarn deploy <environnement> <OPTIONAL:--user USERNAME>
```

> Optionel si vous avez [configuré 1password](./1password.md#automatisation-de-ansible)

### Gestion des migrations

Cli pour créer une migration

```bash
  yarn migration:create -d <name>
```

### Talisman

Ajouter une exception à talisman

```bash
  yarn talisman:add-exception
```

### Vault

Édition du vault ansible

```bash
  yarn vault:edit
```

### Linter

Un linter (via ESLint) est mis en place dans le projet, pour le lancer :

```bash
yarn lint
```

**Note:** eslint est run automatiquement à chaque commit

### Prettier

Prettier est mis en place dans le projet, pour le lancer :

```bash
yarn prettier:fix
```

**Note:** eslint est run automatiquement à chaque commit

### Typescript

L'application utilise TypeScript, pour vérifier que les erreurs liés au type veuillez lancer:

```bash
yarn typecheck
```

### Release depuis l'environnement local

Création d'une release

```bash
  yarn release:interactive
```

### Exécution des tests

Pour exécuter les tests localement, utilisez la commande suivante :

```bash
yarn test
```

Cette commande exécutera tous les tests du projet et vous affichera les résultats.

**Assurez-vous:**

1. D'avoir installé toutes les dépendances via la commande `yarn install` avant de lancer les tests

2. D'avoir lancé l'application car les tests utilisent la base de donnée.

#### Snapshots

Pour mettre à jour les snapshots, utilisez la commande suivante dans `/shared`

```bash
yarn test --update
```

## Emails

Le server SMTP de test [Mailpit](https://github.com/axllent/mailpit) est utilisé localement pour prendre en charge l'envoi d'emails localement.

Vous pouvez accéder à l'interface utilisateur à l'addresse suivante [http://localhost:8025](http://localhost:8025).

## Debugger sous VSCode

Il est possible de débugger facilement **sous VSCode** grace à la configuration Vscode partagée.

### Server Inspect

- Lancer la task `Attach Server`
- Lancer l'application en utilisant la commande `make debug` au lieu de `make start`.

## Organisation des dossiers

- Le dossier `/.infra` contient la configuration de l'instructure.
- Le dossier `/.github` contient l'ensemble des Github Actions.
- Le dossier `/server` contient l'ensemble de l'application coté serveur, à savoir l'API Node Express.
- Le dossier `/shared` contient le code partagé entre l'ui et le server
- Le dossier `/ui` contient l'ensemble de l'application coté front, à savoir le code NextJs.
- Le fichier `/docker-compose.yml` va définir la configuration des services de l'application, \_pour plus d'informations sur Docker cf: https://docs.docker.com/

## Aller plus loin

- [Vault](../Vault.md)
- [Déploiement](./docs/deploy.md)
- [Développement](./docs/developpement/developpement.md)
- [Debugging](./docs/developpement/debug.md)
- [Infrastructure](./docs/infrastructure.md)
- [Sécurité](./docs/securite.md)
