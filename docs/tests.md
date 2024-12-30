# Tests

## Pré-requis

- [Lire la doc développement](./developpement/pre-requesites.md)
- postgresql@15 (pour macos : `brew install postgresql@15`)
- Lancer `yarn test` à la racine

Pour lancer des tests sur un projet en particulier :

- Lancer `yarn vitest --project ui|shared|server-unit|server-integration`

Il est possible de lancer plusieurs projets en même temps :

- Lancer `yarn vitest --project ui --project shared`
