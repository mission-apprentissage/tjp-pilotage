import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { getRoutingSaisieRecueilDemande, getRoutingSyntheseRecueilDemande } from "@/utils/getRoutingRecueilDemande";

describe("ui > utils > createParameterizedUrl", () => {
  it("Doit remplacer le paramètre de requête dans l'URL avec la valeur fournie", () => {
    const url = "/api/user";
    const params = { id: "123" };
    const result = createParameterizedUrl(url, params);
    expect(result).toBe("/api/user?id=123");
  });

  it("Doit remplacer les paramètres de requête dans l'URL avec les valeurs fournies", () => {
    const url = "/api/user";
    const params = { id: "123", name: "Marin" };
    const result = createParameterizedUrl(url, params);
    expect(result).toBe("/api/user?id=123&name=Marin");
  });

  it("Doit remplacer les paramètres de requête en gardant la profondeur d'objet", () => {
    const url = "/api/user";
    const params = { id: "123", user: { firstname: "Marin", lastname: "Orion" } };
    const result = createParameterizedUrl(url, params);
    expect(result).toBe("/api/user?id=123&user[firstname]=Marin&user[lastname]=Orion");
  });
});



const createUserBuilder = ({
  role,
  codeRegion
}:{
  role: Role,
  codeRegion?: string
}): UserType => ({
  id: "test",
  email: "email@test.fr",
  role: role,
  codeRegion: codeRegion,
  uais: [],
});

const createCampagneBuilder = ({
  annee,
  statut = CampagneStatutEnum["en cours"],
  codeRegion,
  withSaisiePerdir,
  hasCampagneRegionEnCours
} : {
  annee: string,
  statut?: CampagneStatut,
  codeRegion?: string,
  withSaisiePerdir?: boolean,
  hasCampagneRegionEnCours?: boolean
}): CampagneType => ({
  id: "testid",
  dateDebut: `${annee}-01-01`,
  dateFin: `${annee}-12-31`,
  annee,
  statut,
  codeRegion,
  withSaisiePerdir,
  hasCampagneRegionEnCours,
});

const fixtureBuilder = () => {
  let user: UserType | undefined = undefined;
  let campagne: CampagneType | undefined = undefined;
  let route: string | undefined = undefined;

  return {
    given: {
      utilisateurAnonyme: () => {
        user = undefined;
      },
      utilisateurNational: async () => {
        user = createUserBuilder({role: RoleEnum["admin"]});
      },
      utilisateurPerdirExpe: async () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "76"});
      },
      utilisateurPerdirHorsExpe: async () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "11"});
      },
      utilisateurRegionExpe: async () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "76"});
      },
      utilisateurRegionHorsExpe: async () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "11"});
      },
      campagne2023: async () => {
        campagne = createCampagneBuilder({annee: "2023"});
      },
      campagne2024: async () => {
        campagne = createCampagneBuilder({annee: "2024"});
      },
      campagne2025: async () => {
        campagne = createCampagneBuilder({annee: "2025"});
      },
      campagneRegionaleEnCoursWithSaisiePerdir: async () => {
        campagne = createCampagneBuilder({annee: "2025", hasCampagneRegionEnCours: true, codeRegion: "76", withSaisiePerdir: true});
      },
      campagneRegionaleEnCoursWithoutSaisiePerdir: async () => {
        campagne = createCampagneBuilder({annee: "2025", hasCampagneRegionEnCours: true, codeRegion: "76", withSaisiePerdir: false });
      },
    },
    when: {
      accesRoutingSaisieRecueilDemande: (suffix?: string) => {
        route = getRoutingSaisieRecueilDemande({campagne, user, suffix});
      },
      accesRoutingSyntheseRecueilDemande: (suffix?: string) => {
        route = getRoutingSyntheseRecueilDemande({campagne, user, suffix});
      }
    },
    then: {
      verifierRouteSaisieHorsExpe: (suffix?: string) => {
        expect(route).toBe(`/intentions/saisie${suffix ? `/${suffix}` : ""}`);
      },
      verifierRouteSaisieExpe: (suffix?: string) => {
        expect(route).toBe(`/intentions/perdir/saisie${suffix ? `/${suffix}` : ""}`);
      },
      verifierRouteSyntheseHorsExpe: (suffix?: string) => {
        expect(route).toBe(`/intentions/synthese${suffix ? `/${suffix}` : ""}`);
      },
      verifierRouteSyntheseExpe: (suffix?: string) => {
        expect(route).toBe(`/intentions/perdir/synthese${suffix ? `/${suffix}` : ""}`);
      },
      verifierRetourAccueil: () => {
        expect(route).toBe("/");
      }
    },
  };
};


describe("ui > utils > getRoutingRecueilDemande", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Doit renvoyer la route hors expé pour la campagne 2023", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRouteSaisieHorsExpe();
  });

  it("Doit renvoyer la route hors expé pour la campagne 2024 si l'utilisateur est hors expé", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRouteSaisieHorsExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2024 si l'utilisateur est dans l'expé", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRouteSaisieExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2024 si l'utilisateur est un perdir de l'expé", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRouteSaisieExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est hors expé", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRetourAccueil();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est hors expé", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2025();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRouteSaisieExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est hors expé", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleEnCoursWithoutSaisiePerdir();

    fixture.when.accesRoutingSaisieRecueilDemande();

    fixture.then.verifierRetourAccueil();
  });
});
