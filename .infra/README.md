# Infrastructure

- [Infrastructure](#infrastructure)
  - [Prérequis](#prérequis)
    - [SSH](#ssh)
    - [GPG](#gpg)
  - [Configuration et déploiement d'un environnement](#configuration-et-déploiement-dun-environnement)
  - [Vault](#vault)
    - [Création du vault](#création-du-vault)
    - [Edition du vault](#edition-du-vault)
    - [Variables du vault](#variables-du-vault)
  - [Habilitations](#habilitations)
    - [Ajout d'un utilisateur](#ajout-dun-utilisateur)
    - [Suppression d'un utilisateur](#suppression-dun-utilisateur)
  - [Modification d'un environnement](#modification-dun-environnement)
    - [Ajouter un disque de sauvegarde externe](#ajouter-un-disque-de-sauvegarde-externe)
    - [Notifications Slack](#notifications-slack)
  - [Création d'un nouvel environnement](#création-dun-nouvel-environnement)
    - [Création du VPS OVH](#création-du-vps-ovh)
    - [Déclaration de l'environnement](#déclaration-de-lenvironnement)
    - [Configuration de l'environnement](#configuration-de-lenvironnement)
  - [Tester les playbook Ansible](#tester-les-playbook-ansible)

## Prérequis

Contient l'ensemble des données sensibles nécessaires à la mise en place de
l'application. Ce projet utilise Ansible 2.7+ pour configurer et déployer l'application.

**Fichier disponible seulement aux personnes habilitées**

- .vault-password.gpg
- habilitations.yml

### SSH

Pour utiliser le projet infra, vous devez avoir une clé SSH, si ce n'est pas le cas, vous pouvez suivre le tutorial
suivant : https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### GPG

Pour utiliser le projet infra, vous devez avoir une clé GPG, si ce n'est pas le cas, vous pouvez en créer une via la
commande :

```bash
 bash scripts/create-gpg-key.sh <prénom> <nom> <email>
```

Une fois terminé, le script va vous indiquer l'identifiant de votre clé GPG. Afin qu'elle puisse être utilisée au sein
de la mission apprentissage, vous devez publier votre clé :

```bash
gpg --send-key <identifiant>
```

Il est vivement conseillé de réaliser un backup des clés publique et privée qui viennent d'être créés.

```bash
gpg --export <identifiant> > public_key.gpg
gpg --export-secret-keys <identifiant> > private_key.gpg
```

Ces deux fichiers peuvent, par exemple, être stockés sur une clé USB.

## Configuration et déploiement d'un environnement

Pour configurer un environnement, il faut lancer la commande suivante :

```
bash scripts/setup-vm.sh <nom_environnement> --user <nom_utilisateur>
```

Il est possible de mettre à jour et déployer uniquement la partie applicative de l'application en lançant le script

```
bash scripts/deploy.sh <nom_environnement> --user <nom_utilisateur>
```

Pour information si votre utilisateur local porte le même nom que l'utilisateur distant alors `--user` n'est pas
nécessaire.

## Vault

Il est vivement recommander de stocker toutes les variables d'environnement sensibles (ex: token) dans un vault Ansible.
Le fichier `ansible/roles/setup/vars/main/vault.yaml` contient déjà les données jugées sensibles.

### Création du vault

Dans un premier temps, vous devez générer le mot de passe du vault. Ce mot de passe sera chiffré via GPG et pourra
uniquement être obtenu par les personnes listées dans le fichier `ansible/roles/setup/vars/main/habilitations.yml`

Pour se faire, lancez la commande suivante :

```bash
  bash scripts/vault/generate-vault-password.sh
```

Cette commande va créer le fichier `ansible/.vault-password.gpg`, vous devez le commiter.

Le mot de passe contenu dans ce fichier va permettre de chiffrer le ficihier `vault.yml`. Pour se
faire, il faut lancer la commande suivante :

```bash
  bash scripts/vault/encrypt-vault.sh
```

Le script va utiliser votre clé GPG et probablement vous demander votre passphrase. Il va ensuite chiffrer le
fichier `ansible/roles/setup/vars/main/vault.yml`.

```yaml
$ANSIBLE_VAULT;1.2;AES256;mnaprojectname_ansible_secret
3566.....
....
```

Vous devez commiter le fichier chiffré.

### Edition du vault

Si vous voulez éditer le vault, le plus simple est d'utiliser un plugin pour votre IDE

- vscode : [https://marketplace.visualstudio.com/items?itemName=dhoeric.ansible-vault]()
- intellij idea : [https://plugins.jetbrains.com/plugin/14278-ansible-vault-editor]()

Quand vous allez ouvrir le fichier, un mot de passe vous sera demandé. Pour l'obtenir, executez la commande suivante

```bash
  bash scripts/vault/get-vault-password-client.sh
```

Vous pouvez également éditer directement le fichier en ligne de commande sans afficher en clair le mot de passe :

```bash
   EDITOR=vim bash scripts/vault/edit-vault.sh ansible/roles/setup/vars/main/vault.yml
   ou
   EDITOR="code -w" bash scripts/vault/edit-vault.sh ansible/roles/setup/vars/main/vault.yml
```

### Variables du vault

Toutes les variables du vault sont préfixées par `vault`

```yaml
vault:
  APP_VERSION: "1.0.0"
  APP_ENV: "recette"
```

Pour y faire référence dans un fichier il suffit d'utiliser la syntaxe `{{ vault.APP_VERSION }}`

Pour créer une variable spécifique à un environnement, le plus simple est d'ajouter une section dans le vault :

```yaml
vault:
  APP_VERSION: "1.0.0"
  production:
    APP_ENV: "production"
  recette:
    APP_ENV: "recette"
```

Pour référencer cette variable dans un fichier, il faut utiliser la syntaxe `{{ vault[env_type].APP_ENV }}`
La variable `env_type` qui est définie dans le fichier `env.ini` sera automatiquement valorisée en fonction de
l'environnement cible.

## Habilitations

### Ajout d'un utilisateur

Il est possible d'ajouter ou de supprimer des habilitations en éditant le
fichier `ansible/roles/setup/vars/main/habilitations.yml`. Tous les utilistateurs présents dans ce fichier pourront se
connecter aux environnements via leurs clés SSH. Ils pourront également accéder au vault et déchiffrer les backups des
environnements si une clé GPG est fournie.

Une habilitation doit être de la forme suivante :

```yml
- username: <nom de l'utilisateur sur l'environnement>
  name: <nom de la personne>
  gpg_key: <identifiant de la clé GPG> (optionnel)
  authorized_keys: <Liste des clés SSH> (il est possible de mettre une url github)
```

Une fois le fichier des habilitations mis à jour, vous devez renouveler le vault et relancer la configuration de
l'environnement.

```bash
  bash scripts/vault/renew-vault.sh
  bash scripts/setup.sh <nom_environnement> --user <nom_utilisateur>
```

### Suppression d'un utilisateur

Pour supprimer une personne des habilitations, il faut :

- enlever les informations renseignées à son sujet dans le fichier `ansible/roles/setup/vars/main/habilitations.yml`
- ajouter le username de la personne dans le fichier `ansible/roles/clean/tasks/main.yml`

Une fois ces fichiers mis à jour, vous devez renouveler le vault et lancer la commande de nettoyage :

```bash
  bash scripts/vault/renew-vault.sh
  bash scripts/clean.sh <nom_environnement> --user <nom_utilisateur>
```

## Modification d'un environnement

### Ajouter un disque de sauvegarde externe

Il est possible d'ajouter un disque externe permettant de sauvegarder l'ensemble des données de l'application. Pour se
faire, il faut la commande suivante

```sh
bash scripts/ovh/create-backup-partition.sh <nom de l'environnement>
```

Lors de l'exécution de ce script, vous serez redirigé vers une page web vous demandant de vous authentifier afin de
générer un jeton d'api. Vous devez donc avoir un compte OVH ayant le droit de gérer les instances de la Mission
Apprentissage. Une fois authentifié, le script utilisera automatiquement ce jeton.

Quand le script est terminé, vous pouvez aller sur l'interface
OVH [https://www.ovh.com/manager/dedicated/#/nasha/zpool-128310/partitions](https://www.ovh.com/manager/dedicated/#/nasha/zpool-128310/partitions)
afin de vérifier que la partition est bien créée.

- Dans le fichier `ansible/env.ini`, vous devez ensuite ajouter la nom de la partition pour l'environnement :

```
backup_partition_name=<nom de la partition>
```

- Relancer le `setup-vm.sh` afin d'appliquer les modifications sur le serveur.

### Notifications Slack

Un mécanisme de banissement d'IP est mis en place dans le dossier :

- `ansible/roles/setup/files/fail2ban`

Pour en savoir plus sur le fail2ban et sa configuration : https://doc.ubuntu-fr.org/fail2ban.

Ce mécanisme se charge de notifier dans une channel Slack lorsqu'une IP est bannie ou débannie.

Pour mettre en place les notifications Slack il est nécessaire d'utiliser les Webhooks et de créer une chaine dédiée
dans votre espace de travail Slack.

Il vous faudra créer une application dans Slack et récupérer le lien de la Webhook, pour en savoir
plus : https://api.slack.com/messaging/webhooks.

Une fois le lien de la Webhook récupéré il faudra stocker l'information dans le vault (`SLACK_WEBHOOK_URL`).

## Création d'un nouvel environnement

## Création d'une app OVH

OVH Europe https://eu.api.ovh.com/createApp/

Conserver les informmations suivantes :

- Application Key
- Application Secret

### Création du VPS OVH

La première étape est de créer un VPS via l'interface d'OVH : https://www.ovhcloud.com/fr/vps/

Une fois le VPS créé, il est nécessaire de configurer le firewall en lançant la commande :

```sh
bash scripts/ovh/create-firewall.sh <nom de l'environnement>
```

Lors de l'exécution de ce script, vous serez redirigé vers une page web vous demandant de vous authentifier afin de
générer un jeton d'api. Vous devez donc avoir un compte OVH ayant le droit de gérer les instances de la Mission
Apprentissage. Une fois authentifié, le script utilisera automatiquement ce jeton.

Quand le script est terminé, vous pouvez aller sur l'interface
OVH [https://www.ovh.com/manager/dedicated/#/configuration/ip?tab=ip](https://www.ovh.com/manager/dedicated/#/configuration/ip?tab=ip)
afin de vérifier que le firewall a été activé pour l'ip du VPS.

### Déclaration de l'environnement

Le fichier `ansible/env.ini` définit les environnements de l'application. Il faut donc ajouter le nouvel environnement
dans ce fichier en renseignant les informations suivantes :

```
[<nom de l'environnemnt>]
<IP>
[<nom de l'environnemnt>:vars]
dns_name=<nom de l'application>.mnaDNSBASE
host_name=<nom de la mahcine (ex: mna-catalogue-production)>
update_sshd_config=true
git_revision=master
env_type=production

```

Pour information, vous pouvez obtenir l'adresse ip du vps en consultant les emails de
service : https://www.ovh.com/manager/dedicated/#/useraccount/emails

### Configuration de l'environnement

Pour configurer l'environnement, il faut lancer la commande suivante :

```
ssh-keyscan <ip> >> ~/.ssh/known_hosts
bash scripts/setup-vm.sh <nom_environnement> --user ubuntu --ask-pass
```

L'utilisateur `ubuntu` est un utilisateur créé par défaut par OVH, le mot de passe de ce compte est envoyé par email à
l'administrateur du compte OVH et est également disponible dans les emails de
service : https://www.ovh.com/manager/dedicated/#/useraccount/emails

Une fois le script terminé, l'application est disponible à l'url qui correspond au `dns_name` dans le fichier `env.ini`

Pour finaliser le création de l'environnement, vous devez vous connecter pour initialiser votre utilisateur :

```
ssh <nom_utilisateur>@<ip>
```

Enfin pour des questions de sécurité, vous devez supprimer l'utilisateur `ubuntu` :

```
bash scripts/clean.sh <nom_environnement> --user <nom_utilisateur>
```

## Tester les playbook Ansible

Il est possible de tester le playbook Ansible en utilisant Vagrant 2.2+ et VirtualBox 5+. Une fois ces deux outils
installés, il faut lancer la commande :

```sh
bash ansible/test/run-playbook-tests.sh
```

Ce script va créer une machine virtuelle dans VirtualBox et exécuter le playbook sur cette VM. Il est ensuite possible
de se connecter à la machine via la commande :

```sh
bash ansible/test/connect-to-vm.sh
```
