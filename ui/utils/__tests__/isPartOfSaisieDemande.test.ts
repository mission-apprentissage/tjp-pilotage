import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { isUserPartOfAccesDemande } from '@/utils/isPartOfAccesDemande';

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
  let isUserPartOfAccesDemandeTest: boolean | undefined = undefined;

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
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "11", withSaisiePerdir: true});
      },
    },
    when: {
      isUserPartOfAccesDemande: () => {
        isUserPartOfAccesDemandeTest = isUserPartOfAccesDemande({campagne, user});
      },
    },
    then: {
      verifierUserPartOfAccesDemande: () => {
        expect(isUserPartOfAccesDemandeTest).toBe(true);
      },
      verifierUserNotPartOfAccesDemande: () => {
        expect(isUserPartOfAccesDemandeTest).toBe(false);
      },
    },
  };
};


describe("ui > utils > isPartOfAccesDemabde", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Doit renvoyer faux pour un utilisateur anonyme et la campagne 2023", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2023();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserNotPartOfAccesDemande();
  });

  it("Doit renvoyer faux pour un utilisateur anonyme et la campagne 2024", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserNotPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur national et la campagne 2024", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur région expé et la campagne 2024", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer faux pour un utilisateur PERDIR hors expé et la campagne 2024", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserNotPartOfAccesDemande();
  });

  it("Doit renvoyer faux pour un utilisateur anonyme et la campagne 2024", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserNotPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur région hors expé et la campagne 2025", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur région expé et la campagne 2025", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir et la campagne 2025", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir et la campagne 2025 même si sa région n'autorise pas la saisie", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleExpeEnCoursWithoutSaisiePerdir();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir et la campagne 2025 dont la campagne régionale autorise la saisie", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleExpeEnCoursWithSaisiePerdir();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir hors de l'expé et la campagne 2025", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir hors de l'expé et la campagne 2025 même si sa région n'autorise pas la saisie", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();

    fixture.when.isUserPartOfAccesDemande();

    fixture.then.verifierUserPartOfAccesDemande();
  });
});
