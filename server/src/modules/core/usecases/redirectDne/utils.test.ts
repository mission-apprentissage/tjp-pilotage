import type { SupportedLDAPGroups} from "shared/security/sso";
import { LDAP_GROUP_ROLES_DNE_CORRESPONDANCE, ROLE_DNE_FONCTION_ORION_CORRESPONDANCE, ROLE_DNE_ROLE_ORION_CORRESPONDANCE, supportedLDAPGroupsEnum } from "shared/security/sso";
import { describe, expect, it } from "vitest";

import { extractInfoFromLDAPGroups } from "./utils";

describe("server > src > modules > core > usecases > redirectDne > utils", () => {
  describe("extractInfoFromLDAPGroups", () => {
    it("Doit retourner un objet vide si les groupes LDAP ne contiennent aucun groupe liés à Orion (prefixe GRP_ORIONIJ)", () => {
      expect(extractInfoFromLDAPGroups(["", "GRP_NON_ORION"])).toEqual({});
    });

    it("Doit retourner role et fonction pour un groupe géré par Orion", () => {
      Object.keys(supportedLDAPGroupsEnum).forEach(grp => {
        const roleDNE = LDAP_GROUP_ROLES_DNE_CORRESPONDANCE[grp as SupportedLDAPGroups];
        expect(extractInfoFromLDAPGroups([grp])).toEqual({
          role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE[roleDNE],
          fonction: ROLE_DNE_FONCTION_ORION_CORRESPONDANCE[roleDNE]
        });
      });
    });
  });
});
