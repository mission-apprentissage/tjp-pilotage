/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/vitest";

import { generateMock } from "@anatine/zod-mock";
import { cleanup, render, screen } from "@testing-library/react";
import type {Role} from "shared";
import { RoleEnum } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { ROUTES } from "shared/routes/routes";
import type { CampagneType } from "shared/schema/campagneSchema";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Auth } from "@/app/authContext";
import { AuthContext } from "@/app/authContext";
import { CurrentCampagneContext } from "@/app/currentCampagneContext";
import { GuardExpe } from "@/utils/security/GuardExpe";

const getUserContext = (role: Role, codeRegion?: string) => {
  const response = generateMock(ROUTES["[GET]/auth/whoAmI"].schema.response[200])!;
  response.user.codeRegion = codeRegion;
  response.user.role = role;
  return { auth: { user: response!.user }, setAuth: (_auth: Auth | undefined) => {} };
};

const getCampagneContext = ({
  annee,
  codeRegion,
  withSaisiePerdir,
  hasCampagneRegionEnCours
} : {
  annee: string,
  codeRegion?: string,
  withSaisiePerdir?: boolean,
  hasCampagneRegionEnCours?: boolean
}) => {
  return {
    campagne: {
      id: "testid",
      dateDebut: `${annee}-01-01`,
      dateFin: `${annee}-12-31`,
      statut: CampagneStatutEnum["en cours"],
      annee,
      codeRegion,
      withSaisiePerdir,
      hasCampagneRegionEnCours,
    },
    setCampagne: (_campagne: CampagneType | undefined) => {}
  };
};

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));


describe("ui > components > security > GuardExpe", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("Doit rediriger les utilisateurs vers la saisie hors expé même si l'utilisateur fait partie d'une région test lors de la campagne 2023", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin_region"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2023"})}>
          <GuardExpe isExpeRoute={true}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/intentions/saisie");
  });

  it("Doit laisser passer les utilisateurs nationaux pour les routes expé", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin"], undefined)}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardExpe isExpeRoute={true}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });


  it("Doit laisser passer les utilisateurs nationaux pour les routes hors expé", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin"], undefined)}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardExpe isExpeRoute={false}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit rediriger les utilisateurs vers la saisie hors expé", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin_region"], "11")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardExpe isExpeRoute={true}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/intentions/saisie");
  });

  it("Doit rediriger les utilisateurs vers la saisie expé", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin_region"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardExpe isExpeRoute={false}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/intentions/perdir/saisie");
  });

  it("Doit rediriger les utilisateurs vers la saisie expé même si l'utilisateur ne fait pas partie d'une région test lors de la campagne 2025", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin_region"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2025"})}>
          <GuardExpe isExpeRoute={false}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/intentions/perdir/saisie");
  });

  it("Doit laisser passer le perdir dans le cas où sa région accepte la saisie perdir pour cette campagne", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({
          annee: "2025",
          codeRegion: "76",
          withSaisiePerdir: true,
          hasCampagneRegionEnCours: true
        })}>
          <GuardExpe isExpeRoute={true}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit rediriger le perdir vers l'accueil dans le cas où sa région n'accepte pas la saisie perdir pour cette campagne", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({
          annee: "2025",
          codeRegion: "76",
          withSaisiePerdir: false,
          hasCampagneRegionEnCours: true
        })}>
          <GuardExpe isExpeRoute={true}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("Doit rediriger le perdir vers l'accueil dans le cas où sa région n'accepte pas la saisie perdir pour cette campagne et l'utilisateur tente d'accéder à une route hors expérimentation", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({
          annee: "2025",
          codeRegion: "76",
          withSaisiePerdir: false,
          hasCampagneRegionEnCours: true
        })}>
          <GuardExpe isExpeRoute={false}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("Doit rediriger le perdir vers la saisie expe dans le cas où sa région accepte la saisie perdir pour cette campagne et l'utilisateur tente d'accéder à une route hors expérimentation", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({
          annee: "2025",
          codeRegion: "76",
          withSaisiePerdir: true,
          hasCampagneRegionEnCours: true
        })}>
          <GuardExpe isExpeRoute={false}>
            <p>has_permission</p>
          </GuardExpe>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(redirectMock).toHaveBeenCalledWith("/intentions/perdir/saisie");
  });
});
