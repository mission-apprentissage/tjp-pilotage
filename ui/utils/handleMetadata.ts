const METADATA_MAP = {
  "/": {
    title: "Accueil - Orion",
    description: "Pilotage de la carte des formations",
  },
  "/auth/login": {
    title: "Connexion - Orion",
    description: "Connexion à votre compte Orion",
  },
  "/panorama/region": {
    title: "Panorama régional - Orion",
    description: "Panorama des formations enseignées dans votre région",
  },
  "/panorama/departement": {
    title: "Panorama départemental - Orion",
    description: "Panorama des formations enseignées dans votre département",
  },
  "/panorama/etablissement": {
    title: "Panorama établissement - Orion",
    description: "Panorama des formations enseignées dans votre établissement",
  },
  "/panorama/lien-metier-formation/formation": {
    title: "Lien formation-métier - Orion",
    description: "Liens entre une formation et les métiers qu'elle prépare",
  },
  "/panorama/lien-metier-formation/metier": {
    title: "Lien métier-formation - Orion",
    description: "Liens entre un métier et les formations qui y mènent",
  },
  "/console/formations": {
    title: "Console des formations - Orion",
    description: "Console des formations dispensées",
  },
  "/console/etablissements": {
    title: "Console des formations par établissement - Orion",
    description: "Console des offres de formation dispensées par les établissements",
  },
  "/intentions/saisie": {
    title: "Demandes - Orion",
    description: "Demandes de transformation de formation",
  },
  "/intentions/saisie/new": {
    title: "Nouvelle demande - Orion",
    description: "Nouvelle demande de transformation de formation",
  },
  "/intentions/saisie/": {
    title: "Modification de la demande - Orion",
    description: "Modification de la demande de transformation de formation",
  },
  "/intentions/synthese": {
    title: "Synthèse de la demande  - Orion",
    description: "Synthèse de la demande de transformation de formation",
  },
  "/intentions/perdir/saisie": {
    title: "Demandes - Orion",
    description: "Demandes de transformation de formation",
  },
  "/intentions/perdir/saisie/new": {
    title: "Nouvelle demande - Orion",
    description: "Nouvelle demande de transformation de formation",
  },
  "/intentions/perdir/saisie/": {
    title: "Modification de la demande - Orion",
    description: "Modification de la demande de transformation de formation",
  },
  "/intentions/perdir/synthese": {
    title: "Synthèse de la demande  - Orion",
    description: "Synthèse de la demande de transformation de formation",
  },
  "/intentions/pilotage": {
    title: "Pilotage de la transformation - Orion",
    description: "Pilotage de la transformation de la carte de formations",
  },
  "/intentions/restitution": {
    title: "Restitution des demandes de transformation - Orion",
    description: "Restitution des demandes de transformation de formation",
  },
  "/intentions/corrections": {
    title: "Restitution des corrections de demandes de transformation - Orion",
    description: "Restitution des corrections de demandes de transformation de formation",
  },
  "/suivi-impact": {
    title: "Suivi de l'impact - Orion",
    description: "Suivi de l'évolution de la carte de formations",
  },
  "/admin/campagnes": {
    title: "Administration des campagnes - Orion",
    description: "Administration des campagnes",
  },
  "/admin/campagnes/regional": {
    title: "Administration des campagnes régionales - Orion",
    description: "Administration des campagnes régionales",
  },
  "/admin/users": {
    title: "Administration des utilisateurs - Orion",
    description: "Administration des utilisateurs",
  },
  "/admin/roles": {
    title: "Administration des rôles - Orion",
    description: "Administration des rôles",
  },
  "/mentions-legales": {
    title: "Mentions légales - Orion",
    description: "Mentions légales",
  },
  "/declaration-accessibilite": {
    title: "Déclaration d'accessibilité - Orion",
    description: "Déclaration d'accessibilité",
  },
  "/changelog": {
    title: "Journal des modifications - Orion",
    description: "Journal des modifications",
  },
  "/glossaire": {
    title: "Glossaire - Orion",
    description: "Glossaire",
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialité - Orion",
    description: "Politique de confidentialité",
  },
  "/cgu": {
    title: "Conditions générales d'utilisation - Orion",
    description: "Conditions générales d'utilisation",
  },
  "/statistiques": {
    title: "Statistiques - Orion",
    description: "Statistiques",
  },
  "/ressources": {
    title: "Ressources - Orion",
    description: "Ressources et données d'Orion",
  },
  "/maintenance": {
    title: "Maintenance - Orion",
    description: "Maintenance",
  },
  "/panorama/domaine-de-formation": {
    title: "Panorama domaine de formation - Orion",
    description: "Panorama des formations enseignées dans un domaine de formation",
  },
  "/domaine-de-formation/": {
    title: "Domaines de formation - Orion",
    description: "Domaines de formation",
  },
  // Autres chemins possibles
};

/**
 * Get the pathname from the metadata state
 * This dives into async storage of promise state to get the pathname
 *
 * This is much more performant that using headers() from next as this doesn't opt out from the cache
 * @param state
 *
 * cf https://github.com/vercel/next.js/discussions/50189#discussioncomment-9224262
 */
const getPathnameFromMetadataState = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any
): string | undefined => {
  const symbols = Object.getOwnPropertySymbols(state || {});

  if (symbols.length === 0) {
    return undefined;
  }

  const res = symbols
    .map((p) => state[p])
    .filter((state) => state)
    .find((state) => Object.prototype.hasOwnProperty.call(state, "urlPathname"));

  return res?.urlPathname.replace(/\?.+/, "");
};

/**
 *
 * @param pathname
 * @returns
 */
const extractBasePathname = (pathname: string) => {
  if (pathname.includes("/panorama/region")) {
    return "/panorama/region";
  }
  if (pathname.includes("/panorama/departement")) {
    return "/panorama/departement";
  }
  if (pathname.includes("/panorama/etablissement")) {
    return "/panorama/etablissement";
  }
  if (pathname.includes("/panorama/lien-metier-formation/formation")) {
    return "/panorama/lien-metier-formation/formation";
  }
  if (pathname.includes("/panorama/lien-metier-formation/metier")) {
    return "/panorama/lien-metier-formation/metier";
  }
  if (pathname.includes("/intentions/perdir/synthese")) {
    return "/intentions/perdir/synthese";
  }
  if (pathname.includes("/intentions/synthese")) {
    return "/intentions/synthese";
  }
  if (pathname.includes("/intentions/saisie/new")) {
    return "/intentions/saisie/new";
  }
  if (pathname.includes("/intentions/perdir/saisie/new")) {
    return "/intentions/perdir/saisie/new";
  }
  if (pathname.includes("/intentions/saisie/")) {
    return "/intentions/saisie/";
  }
  if (pathname.includes("/intentions/perdir/saisie/")) {
    return "/intentions/perdir/saisie/";
  }
  if (pathname.includes("/intentions/saisie")) {
    return "/intentions/saisie";
  }
  if (pathname.includes("/intentions/perdir/saisie")) {
    return "/intentions/perdir/saisie";
  }
  if (pathname.includes("/domaine-de-formation/")) {
    return "/domaine-de-formation";
  }
  return pathname;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMetadata(state: any) {
  const basePathname = extractBasePathname(getPathnameFromMetadataState(state) ?? "") as keyof typeof METADATA_MAP;
  // Renvoie les métadonnées correspondantes au chemin ou un fallback
  return (
    METADATA_MAP[basePathname] || {
      title: "Orion",
      description: "Pilotage de la carte des formations",
    }
  );
}
