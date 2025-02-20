import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { getRoutingSaisieRecueilDemande, getRoutingSyntheseRecueilDemande } from "@/utils/getRoutingRecueilDemande";

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
} : {
  annee: string,
  statut?: CampagneStatut,
  codeRegion?: string,
  withSaisiePerdir?: boolean,
}): CampagneType => ({
  id: "testid",
  dateDebut: `${annee}-01-01`,
  dateFin: `${annee}-12-31`,
  annee,
  statut,
  codeRegion,
  withSaisiePerdir,
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
      utilisateurNational: () => {
        user = createUserBuilder({role: RoleEnum["admin"]});
      },
      utilisateurPerdirExpe: () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "76"});
      },
      utilisateurPerdirHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "11"});
      },
      utilisateurRegionExpe: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "76"});
      },
      utilisateurRegionHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "11"});
      },
      campagne2023: () => {
        campagne = createCampagneBuilder({annee: "2023"});
      },
      campagne2024: () => {
        campagne = createCampagneBuilder({annee: "2024"});
      },
      campagne2025: () => {
        campagne = createCampagneBuilder({annee: "2025"});
      },
      campagneRegionaleExpeEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "76", withSaisiePerdir: true});
      },
      campagneRegionaleExpeEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "76", withSaisiePerdir: false });
      },
      campagneRegionaleHorsExpeEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "11", withSaisiePerdir: true});
      },
      campagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "11", withSaisiePerdir: false });
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

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseHorsExpe();
  });

  it("Doit renvoyer la route hors expé pour la campagne 2024 si l'utilisateur est hors expé", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieHorsExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseHorsExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2024 si l'utilisateur est dans l'expé", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2024 si l'utilisateur est un perdir de l'expé", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });

  it("Doit renvoyer la saisie pour la campagne 2024 si l'utilisateur est hors expé", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne2024();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieHorsExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseHorsExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur région est hors expé", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2025();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est un PERDIR ", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleExpeEnCoursWithSaisiePerdir();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est un PERDIR et que sa région n'autorise pas la saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleExpeEnCoursWithoutSaisiePerdir();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est un PERDIR hors expé", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });

  it("Doit renvoyer la route expé pour la campagne 2025 même si l'utilisateur est un PERDIR hors expé et que sa région n'autorise pas la saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir();

    fixture.when.accesRoutingSaisieRecueilDemande();
    fixture.then.verifierRouteSaisieExpe();

    fixture.when.accesRoutingSyntheseRecueilDemande();
    fixture.then.verifierRouteSyntheseExpe();
  });
});
