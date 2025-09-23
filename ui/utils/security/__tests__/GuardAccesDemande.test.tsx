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
import { GuardAccesDemande } from "@/utils/security/GuardAccesDemande";

const getUserContext = (role: Role, codeRegion?: string) => {
  const response = generateMock(ROUTES["[GET]/auth/whoAmI"].schema.response[200])!;
  response.user.codeRegion = codeRegion;
  response.user.role = role;
  return { auth: { user: response.user }, setAuth: (_auth: Auth | undefined) => {} };
};

const getCampagneContext = ({
  annee,
  codeRegion,
  withSaisiePerdir
} : {
  annee: string,
  codeRegion?: string,
  withSaisiePerdir?: boolean
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
    },
    setCampagne: (_campagne: CampagneType | undefined) => {}
  };
};

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));


describe("ui > components > security > GuardAccesDemande", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("Doit laisser passer les utilisateurs nationaux", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin"])}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardAccesDemande>
            <p>has_permission</p>
          </GuardAccesDemande>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit laisser passer les utilisateurs admin région d'AURA quand la saisie était autorisée en 2024", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["admin_region"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardAccesDemande>
            <p>has_permission</p>
          </GuardAccesDemande>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit laisser passer les utilisateurs perdir d'AURA quand la saisie était autorisée en 2024", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({annee: "2024"})}>
          <GuardAccesDemande>
            <p>has_permission</p>
          </GuardAccesDemande>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit laisser passer le perdir dans le cas où sa région accepte la saisie perdir pour cette campagne", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({
          annee: "2025",
          codeRegion: "76",
          withSaisiePerdir: true,
        })}>
          <GuardAccesDemande>
            <p>has_permission</p>
          </GuardAccesDemande>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit laisser passer le perdir même si sa région n'accepte pas la saisie perdir pour cette campagne", async () => {
    render(
      <AuthContext.Provider value={getUserContext(RoleEnum["perdir"], "76")}>
        <CurrentCampagneContext.Provider value={getCampagneContext({
          annee: "2025",
          codeRegion: "76",
          withSaisiePerdir: false,
        })}>
          <GuardAccesDemande>
            <p>has_permission</p>
          </GuardAccesDemande>
        </CurrentCampagneContext.Provider>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).not.toBe(null);
  });
});
