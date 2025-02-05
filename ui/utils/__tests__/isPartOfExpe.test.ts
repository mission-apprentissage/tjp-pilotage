import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { isUserPartOfExpe } from '@/utils/isPartOfExpe';

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
  let isUserPartOfExpeTest: boolean | undefined = undefined;

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
      campagneRegionaleEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", hasCampagneRegionEnCours: true, codeRegion: "76", withSaisiePerdir: true});
      },
      campagneRegionaleEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", hasCampagneRegionEnCours: true, codeRegion: "76", withSaisiePerdir: false });
      },
    },
    when: {
      isUserPartOfExpe: () => {
        isUserPartOfExpeTest = isUserPartOfExpe({campagne, user});
      },
    },
    then: {
      verifierUserPartOfExpe: () => {
        expect(isUserPartOfExpeTest).toBe(true);
      },
      verifierUserNotPartOfExpe: () => {
        expect(isUserPartOfExpeTest).toBe(false);
      },
    },
  };
};


describe("ui > utils > getRoutingRecueilDemande", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Doit renvoyer faux pour un utilisateur anonyme et la campagne 2023", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2023();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur national et la campagne 2023", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur anonyme et la campagne 2024", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer vrai pour un utilisateur national et la campagne 2024", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur hors région expé et la campagne 2024", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer vrai pour un utilisateur région expé et la campagne 2024", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur PERDIR hors expé et la campagne 2024", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne2024();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur anonyme et la campagne 2024", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer vrai pour un utilisateur région hors expé et la campagne 2025", () => {
    fixture.given.utilisateurRegionHorsExpe();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserPartOfExpe();
  });

  it("Doit renvoyer vrai pour un utilisateur région expé et la campagne 2025", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserPartOfExpe();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir et la campagne 2025", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2025();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur perdir et la campagne 2025 dont la campagne régionale n'autorise pas la saisie", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleEnCoursWithoutSaisiePerdir();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });

  it("Doit renvoyer vrai pour un utilisateur perdir et la campagne 2025 dont la campagne régionale autorise la saisie", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleEnCoursWithSaisiePerdir();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserPartOfExpe();
  });

  it("Doit renvoyer faux pour un utilisateur perdir et la campagne 2025 dont une autre campagne régionale autorise la saisie", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleEnCoursWithSaisiePerdir();

    fixture.when.isUserPartOfExpe();

    fixture.then.verifierUserNotPartOfExpe();
  });
});
