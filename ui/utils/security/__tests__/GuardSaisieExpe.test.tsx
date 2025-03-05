/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/vitest";

import { generateMock } from '@anatine/zod-mock';
import { cleanup, render, screen } from "@testing-library/react";
import type { Role } from "shared";
import { RoleEnum } from "shared";
import type { CampagneStatut } from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import { ROUTES } from 'shared/routes/routes';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from 'shared/schema/userSchema';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Auth } from "@/app/authContext";
import { AuthContext } from "@/app/authContext";
import { CurrentCampagneContext } from "@/app/currentCampagneContext";
import { GuardSaisieExpe } from "@/utils/security/GuardSaisieExpe";

const createUserBuilder = ({
  role,
  codeRegion
}: {
  role: Role,
  codeRegion?: string
}): UserType => ({
  id: "test",
  email: "email@test.fr",
  role: role,
  codeRegion: codeRegion,
  uais: [],
});

const createAuthContextBuilder = ({ role, codeRegion }: { role: Role, codeRegion?: string }) => {
  const response = generateMock(ROUTES["[GET]/auth/whoAmI"].schema.response[200])!;
  response.user.codeRegion = codeRegion;
  response.user.role = role;
  return { auth: { user: response!.user }, setAuth: (_auth: Auth | undefined) => { } };
};

const createCampagneBuilder = ({
  annee,
  statut = CampagneStatutEnum["en cours"],
  codeRegion,
  withSaisiePerdir,
}: {
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

const createCampagneContextBuilder = ({
  annee,
  statut = CampagneStatutEnum["en cours"],
  codeRegion,
  withSaisiePerdir,
}: {
  annee: string,
  statut?: CampagneStatut,
  codeRegion?: string,
  withSaisiePerdir?: boolean,
}) => {
  return {
    campagne: createCampagneBuilder({ annee, statut, codeRegion, withSaisiePerdir }),
    setCampagne: (_campagne: CampagneType | undefined) => { }
  };
};

const fixtureBuilder = () => {
  let campagne: CampagneType = createCampagneBuilder({ annee: "2023" });
  let authContextValue: {
    auth: Auth | undefined,
    setAuth: (auth: Auth | undefined) => void
  } = createAuthContextBuilder({ role: RoleEnum["admin"] });
  let currentCampagneContextValue: {
    campagne: CampagneType | undefined,
    setCampagne: (campagne: CampagneType | undefined) => void
  } = createCampagneContextBuilder({ annee: "2023" });
  let pathname = "/intentions/perdir/saisie/new";

  const updatePathnameMock = (newPathname: string) => {
    pathname = newPathname;
    (usePathnameMock as Mock).mockReturnValue(newPathname);
  };

  return {
    given: {
      utilisateurAnonyme: () => {
        authContextValue = { auth: undefined, setAuth: (_auth: Auth | undefined) => { } };
      },
      utilisateurNational: () => {
        authContextValue = createAuthContextBuilder({ role: RoleEnum["admin"] });
      },
      utilisateurPerdirExpe: () => {
        authContextValue = createAuthContextBuilder({ role: RoleEnum["perdir"], codeRegion: "76" });
      },
      utilisateurPerdirHorsExpe: () => {
        authContextValue = createAuthContextBuilder({ role: RoleEnum["perdir"], codeRegion: "11" });
      },
      utilisateurRegionExpe: () => {
        authContextValue = createAuthContextBuilder({ role: RoleEnum["admin_region"], codeRegion: "76" });
      },
      utilisateurRegionHorsExpe: () => {
        authContextValue = createAuthContextBuilder({ role: RoleEnum["admin_region"], codeRegion: "11" });
      },
      campagne2023: () => {
        campagne = createCampagneBuilder({ annee: "2023" });
      },
      campagne2024: () => {
        campagne = createCampagneBuilder({ annee: "2024" });
      },
      campagne2025: () => {
        campagne = createCampagneBuilder({ annee: "2025" });
      },
      campagneRegionaleExpeEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({ annee: "2025", codeRegion: "76", withSaisiePerdir: true });
      },
      campagneRegionaleExpeEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({ annee: "2025", codeRegion: "76", withSaisiePerdir: false });
      },
      campagneRegionaleHorsExpeEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({ annee: "2025", codeRegion: "11", withSaisiePerdir: true });
      },
      campagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({ annee: "2025", codeRegion: "11", withSaisiePerdir: false });
      },
      currentCampagne2023: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2023" });
      },
      currentCampagne2024: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2024" });
      },
      currentCampagne2025: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2025" });
      },
      currentCampagneRegionaleExpeEnCoursWithSaisiePerdir: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2025", codeRegion: "76", withSaisiePerdir: true });
      },
      currentCampagneRegionaleExpeEnCoursWithoutSaisiePerdir: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2025", codeRegion: "76", withSaisiePerdir: false });
      },
      currentCampagneRegionaleHorsExpeEnCoursWithSaisiePerdir: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2025", codeRegion: "11", withSaisiePerdir: true });
      },
      currentCampagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir: () => {
        currentCampagneContextValue = createCampagneContextBuilder({ annee: "2025", codeRegion: "11", withSaisiePerdir: false });
      },
      pathnameNew: () => {
        updatePathnameMock("/intentions/perdir/saisie/new");
      },
      pathnameEdit: () => {
        updatePathnameMock("/intentions/perdir/saisie/notnew");
      }
    },
    when: {
      accesSaisieExpe: () => {
        render(
          <AuthContext.Provider value={authContextValue}>
            <CurrentCampagneContext.Provider value={currentCampagneContextValue}>
              <GuardSaisieExpe campagne={campagne}>
                <p>has_permission</p>
              </GuardSaisieExpe>
            </CurrentCampagneContext.Provider>
          </AuthContext.Provider>
        );
      },
    },
    then: {
      verifierAccesSaisieExpe: () => {
        const textToFind = screen.queryByText("has_permission");
        expect(textToFind).not.toBe(null);
      },
      verifierNotAccesSaisieExpe: () => {
        const textToFind = screen.queryByText("has_permission");
        expect(textToFind).toBe(null);
      },
      verifierRedirectionAccueil: () => {
        expect(redirectMock).toHaveBeenCalledWith("/");
      },
      verifierRedirectionSaisieExpe: () => {
        expect(redirectMock).toHaveBeenCalledWith("/intentions/perdir/saisie");
      },
      verifierRedirectionSaisieHorsExpe: () => {
        expect(redirectMock).toHaveBeenCalledWith("/intentions/saisie");
      }
    },
  };
};

const redirectMock = vi.hoisted(() => vi.fn());
const usePathnameMock = vi.hoisted(() => vi.fn(() => "/intentions/perdir/saisie/new"));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: usePathnameMock,
}));

describe("ui > components > security > GuardSaisieExpe", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  afterEach(() => {
    cleanup();
    vi.mock("next/navigation", () => ({
      redirect: redirectMock,
      usePathname: usePathnameMock,
    }));
  });

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  // Redirections vers l'accueil

  it("Doit rediriger les users anonymes sur une nouvelle demande", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionAccueil();
  });

  it("Doit rediriger les users anonymes sur une demande existante", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionAccueil();
  });

  // Redirections vers la boîte de réception

  it("Doit rediriger vers la boîte de réception expé les user perdir expé sur une nouvelle demande sur une campagne nationale", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagne2024();
    fixture.given.campagne2024();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionSaisieExpe();
  });

  it("Doit rediriger vers la boîte de réception hors expé les user perdir hors expe sur une demande existante sur une campagne nationale", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.currentCampagne2024();
    fixture.given.campagne2024();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionSaisieHorsExpe();
  });

  it("Doit rediriger vers la boîte de réception hors expé les user perdir hors expe sur une nouvelle demande sur une campagne régionale avec saisie perdir d'une autre région", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.currentCampagneRegionaleExpeEnCoursWithSaisiePerdir();
    fixture.given.campagneRegionaleExpeEnCoursWithSaisiePerdir();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionSaisieHorsExpe();
  });

  it("Doit rediriger les user perdir expe sur une demande existante sur une campagne régionale sans saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagneRegionaleExpeEnCoursWithoutSaisiePerdir();
    fixture.given.campagneRegionaleExpeEnCoursWithoutSaisiePerdir();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionSaisieExpe();
  });

  it("Doit rediriger les user perdir expe sur une nouvelle demande sur une campagne régionale sans saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagneRegionaleExpeEnCoursWithoutSaisiePerdir();
    fixture.given.campagneRegionaleExpeEnCoursWithoutSaisiePerdir();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionSaisieExpe();
  });

  it("Doit rediriger les user perdir hors expe sur une nouvelle demande sur une campagne régionale sans saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.currentCampagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierNotAccesSaisieExpe();
    fixture.then.verifierRedirectionSaisieExpe();
  });

  it("Doit laisser passer les user perdir hors expe sur une nouvelle demande sur une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.currentCampagneRegionaleHorsExpeEnCoursWithSaisiePerdir();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });

  // Laissé passer

  it("Doit laisser passer les user perdir expé sur une demande existante sur une campagne nationale", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagne2024();
    fixture.given.campagne2024();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });

  it("Doit laisser passer les user perdir expé sur une demande existante sur une campagne nationale avec une campagne régionale en cours", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagneRegionaleExpeEnCoursWithoutSaisiePerdir();
    fixture.given.campagne2024();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });

  it("Doit laisser passer les user perdir expé sur une demande existante sur une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagneRegionaleExpeEnCoursWithSaisiePerdir();
    fixture.given.campagneRegionaleExpeEnCoursWithSaisiePerdir();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });

  it("Doit laisser passer les user perdir expe sur une nouvelle demande sur une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.currentCampagneRegionaleExpeEnCoursWithSaisiePerdir();
    fixture.given.campagneRegionaleExpeEnCoursWithSaisiePerdir();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });
  it("Doit laisser passer les user perdir expe sur une demande existante sur une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.currentCampagneRegionaleHorsExpeEnCoursWithSaisiePerdir();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();
    fixture.given.pathnameEdit();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });

  it("Doit laisser passer les user perdir hors expé sur une nouvelle demande sur une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.currentCampagneRegionaleHorsExpeEnCoursWithSaisiePerdir();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();
    fixture.given.pathnameNew();

    fixture.when.accesSaisieExpe();

    fixture.then.verifierAccesSaisieExpe();
  });
});
