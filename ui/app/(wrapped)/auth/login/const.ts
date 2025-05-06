import type { DneSSOErrorsType } from "shared/enum/dneSSOErrorsEnum";
import type { DneSSOInfoType } from "shared/enum/dneSSOInfoEnum";


export const ERROR_MESSAGES: Record<DneSSOErrorsType, { title: string, message: React.ReactNode }> = {
  "FAILURE_ON_DNE_REDIRECT": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de ré-essayer ultérieurement ou de vous rapprocher de votre support technique si le problème persiste."
  },
  "MISSING_USER_EMAIL": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Votre adresse email ne nous est pas parvenue, merci de ré-essayer ultérieurement ou de vous rapproche de votre support technique si le problème persiste."
  },
  "USER_NOT_ENABLED": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Votre compte a été désactivé, merci de contacter votre administrateur en région académique."
  },
  "MISSING_RIGHTS": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de vous rapprocher de votre support technique. Veuillez demander à vérifier que vous êtes dans le bon groupe LDAP correspondant à votre fonction."
  },
  "MISSING_RIGHTS_PERDIR": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de vous rapprocher de votre support technique. Veuillez demander à vérifier que vous avez les droits relatifs à votre fonction et votre établissement."
  },
  "MISSING_CODE_REGION_CODACA": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Votre rôle sur Orion dépend d'une adresse email académique ansi qu'un code académique (codaca) associé. Merci de vous rapprocher de votre support technique pour qu'il vérifie ces éléments."
  },
  "MISSING_CODE_REGION_PERDIR": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Nous n'avons pas votre établissement de référence dans notre base de données. Merci de vous rapprocher de votre support technique pour qu'il remonte la demande à nos services."
  },
  "MISSING_USERINFO": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de ré-essayer ultérieurement ou de vous rapprocher de votre support technique si le problème persiste."
  },
  "MISSING_CODE_VERIFIER": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de ré-essayer ultérieurement ou de vous rapprocher de votre support technique si le problème persiste."
  },
  "MISSING_CODEVERIFIERJWT": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de ré-essayer ultérieurement ou de vous rapprocher de votre support technique si le problème persiste."
  },
  "MISSING_ACCESS_TOKEN": {
    title: "Erreur lors de la connexion à Orion",
    message: "Nous n'avons pas réussi à établir une connexion. Merci de ré-essayer ultérieurement ou de vous rapprocher de votre support technique si le problème persiste."
  },
};

export const INFO_MESSAGES: Record<DneSSOInfoType, { title?: string, message?: string }> = {
  "USER_CREATED": {
    title: "Bienvenue sur Orion",
  },
  "USER_LOGGED_IN": {
    title: "Vous êtes connecté",
  },
  "USER_SWITCHED": {
    message: "Vous avez utilisé la connexion par SSO depuis votre portail. Nous avons mis à jour votre compte Orion et désactivé la possibilité de vous connecter directement par email et mot de passe. Merci d'utiliser uniquement la connexion depuis votre portail.",
  }
};
