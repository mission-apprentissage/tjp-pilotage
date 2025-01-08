import { describe, expect, it } from "vitest";

import { getScopeFilterForUser } from "./getScopeFilterForUser";

const requestUser = {
  id: "requestUserId",
  email: "requestUser@requestUser.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
  codeRegion: "84",
  role: "admin_region",
} as const;

describe("getScopeFilterForUser", () => {
  it("should retrieve a scopeFilter array if user permission scope is region", () => {
    expect(getScopeFilterForUser("users/lecture", requestUser)).toEqual({
      scope: "region",
      scopeFilter: ["84"],
    });
  });

  it("should not retrieve a scope filter array if user permission scope is not region", () => {
    expect(
      getScopeFilterForUser("users/lecture", {
        ...requestUser,
        role: "admin",
      }),
    ).toEqual({
      scope: "national",
      scopeFilter: [],
    });
  });
});
