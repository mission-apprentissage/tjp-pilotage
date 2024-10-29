# 1Password

## Accès

Pour récupérer les secrets, vous devez avoir accès au vault 1password `vault-passwords-common`. Rapprochez vous de l'équipe transverse pour y avoir accès.

## 1Password CLI

Installez [1Password CLI](https://developer.1password.com/docs/cli/get-started/)

## SSH using 1Password

Il est possible d'utiliser 1Password pour stoquer votre SSH key https://developer.1password.com/docs/ssh/get-started

## Automatisation de Ansible

La majoritée des commandes ansible vous demanderons votre nom d'utilisateur et votre mot de passe pour l'exécution de commandes sur les serveur.

Il est possible d'utiliser 1password pour automatiquement récupérer votre credentials.

Pour cela, crée pour chaque environnement dans 1password des items de type `Login` avec:

- Nom: `<project-name>-<env-name>` comme par exemple `tmpl-production`
- `username`: votre username
- `password`: votre mot de passe
