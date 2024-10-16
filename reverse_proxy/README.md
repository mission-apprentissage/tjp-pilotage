# Reverse Proxy

## Maintenance mode

Pour lancer le mode maintenance, il faut créer un fichier dans le conteneur docker `pilotage_reverse_proxy`.

Ce fichier doit s'appeler `maintenance.enable` et être placé dans le dossier `/etc/nginx/html`.

Voici la commande pour créer le fichier :

```bash
sudo docker exec -it pilotage_reverse_proxy touch /etc/nginx/html/maintenance.enable
```

Pour sortir du mode maintenance il faut supprimer le fichier :

```bash
sudo docker exec -it pilotage_reverse_proxy rm /etc/nginx/html/maintenance.enable
```

## Maintenance page

La page à modifier est la page suivante : `/etc/nginx/html/maintenance.html`
