/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/vitest";

import { generateMock } from "@anatine/zod-mock";
import { cleanup, render, screen } from "@testing-library/react";
import { ROUTES } from "shared/routes/routes";
import { RoleEnum } from "shared/security/permissions";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Auth } from "@/app/(wrapped)/auth/authContext";
import { AuthContext } from "@/app/(wrapped)/auth/authContext";
import { GuardPermission } from "@/utils/security/GuardPermission";

const router = {
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  push: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock(import("next/navigation"), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useRouter: () => {
      return router;
    },
  };
});

const response = generateMock(ROUTES["[GET]/auth/whoAmI"].schema.response[200])!;
response.user.role = RoleEnum.invite;
const contextValue = { auth: { user: response!.user }, setAuth: (auth: Auth | undefined) => {} };

describe("ui > components > security > GuardPermission", () => {
  afterEach(() => {
    cleanup();
  });

  it("Doit laisser passer les utilisateurs ayant les droits", async () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <GuardPermission permission="enregistrement-requete/lecture">
          <p>has_permission</p>
        </GuardPermission>
      </AuthContext.Provider>
    );

    const textToFind = screen.queryByText("has_permission");
    expect(textToFind).not.toBe(null);
  });

  it("Doit bloquer les utilisateurs n'ayant pas les droits et les rediriger", async () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <GuardPermission permission="pilotage-intentions/lecture">
          <p>has_permission</p>
        </GuardPermission>
      </AuthContext.Provider>
    );

    const textToBeNull = screen.queryByText("has_permission");
    expect(textToBeNull).toBe(null);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
