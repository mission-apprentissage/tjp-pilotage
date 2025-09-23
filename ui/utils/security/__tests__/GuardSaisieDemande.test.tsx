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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Auth } from "@/app/authContext";
import { AuthContext } from "@/app/authContext";
import { CurrentCampagneContext } from "@/app/currentCampagneContext";
import { GuardSaisieDemande } from "@/utils/security/GuardSaisieDemande";

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
  const currentCampagneContextValue: {
    campagne: CampagneType | undefined,
    setCampagne: (campagne: CampagneType | undefined) => void
  } = createCampagneContextBuilder({ annee: "2023" });

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
    },
    when: {
      accesSaisieDemande: () => {
        render(
          <AuthContext.Provider value={authContextValue}>
            <CurrentCampagneContext.Provider value={currentCampagneContextValue}>
              <GuardSaisieDemande campagne={campagne}>
                <p>has_permission</p>
              </GuardSaisieDemande>
            </CurrentCampagneContext.Provider>
          </AuthContext.Provider>
        );
      },
    },
    then: {
      verifierAccesSaisieDemande: () => {
        const textToFind = screen.queryByText("has_permission");
        expect(textToFind).not.toBe(null);
      },
      verifierNotAccesSaisieDemande: () => {
        const textToFind = screen.queryByText("has_permission");
        expect(textToFind).toBe(null);
      },
      verifierRedirectionAccueil: () => {
        expect(redirectMock).toHaveBeenCalledWith("/");
      },
      verifierRedirectionSaisieDemande: () => {
        expect(redirectMock).toHaveBeenCalledWith("/demandes/saisie");
      },
    },
  };
};

const redirectMock = vi.hoisted(() => vi.fn());
const usePathnameMock = vi.hoisted(() => vi.fn(() => "/demandes/saisie/new"));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: usePathnameMock,
}));

describe("ui > components > security > GuardSaisieDemande", () => {
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

    fixture.when.accesSaisieDemande();

    fixture.then.verifierNotAccesSaisieDemande();
    fixture.then.verifierRedirectionAccueil();
  });

  // Redirections vers la boîte de réception

  it("Doit rediriger vers la boîte de réception expé les user perdir expé sur une demande d'une campagne nationale", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierAccesSaisieDemande();
  });

  it("Doit rediriger vers la boîte de réception hors expé les user perdir hors expe sur une demande d'une campagne nationale", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne2024();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierNotAccesSaisieDemande();
    fixture.then.verifierRedirectionAccueil();
  });

  it("Doit rediriger les user perdir expe sur une demande d'une campagne régionale sans saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleExpeEnCoursWithoutSaisiePerdir();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierNotAccesSaisieDemande();
    fixture.then.verifierRedirectionSaisieDemande();
  });

  it("Doit rediriger les user perdir hors expe sur une demande d'une campagne régionale sans saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithoutSaisiePerdir();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierNotAccesSaisieDemande();
    fixture.then.verifierRedirectionSaisieDemande();
  });

  it("Doit laisser passer les user perdir hors expe sur une demande d'une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierAccesSaisieDemande();
  });

  // Laissé passer

  it("Doit laisser passer les user perdir expé sur une demande d'une campagne nationale", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierAccesSaisieDemande();
  });

  it("Doit laisser passer les user perdir expé sur une demande d'une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagneRegionaleExpeEnCoursWithSaisiePerdir();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierAccesSaisieDemande();
  });

  it("Doit laisser passer les user perdir hors expé sur une demande d'une campagne régionale avec saisie perdir", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagneRegionaleHorsExpeEnCoursWithSaisiePerdir();

    fixture.when.accesSaisieDemande();

    fixture.then.verifierAccesSaisieDemande();
  });
});
