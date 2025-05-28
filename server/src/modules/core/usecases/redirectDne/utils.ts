import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { flatten, uniq } from "lodash-es";
import type { UserinfoResponse } from "openid-client";
import type { Role } from "shared";
import { DneSSOErrorsEnum } from "shared/enum/dneSSOErrorsEnum";
import type { DneSSOInfoType } from "shared/enum/dneSSOInfoEnum";
import type { UserFonction } from "shared/enum/userFonctionEnum";
import type { SupportedLDAPGroups } from "shared/security/sso";
import { LDAP_GROUP_ROLES_DNE_CORRESPONDANCE, ROLE_DNE_FONCTION_ORION_CORRESPONDANCE, ROLE_DNE_ROLE_ORION_CORRESPONDANCE, RoleDNEEnum } from "shared/security/sso";

import type { ExtraUserInfo, UserCommunicationArguments } from "./types";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(customParseFormat);

export const generateUserCommunication =
  ({ userCreated, passwordDeleted }: UserCommunicationArguments): Array<DneSSOInfoType> => {
    const userCommunication: Array<DneSSOInfoType> = [];

    if (userCreated) {
      userCommunication.push("USER_CREATED");
    }

    if (passwordDeleted) {
      userCommunication.push("USER_SWITCHED");
    }

    return userCommunication;
  };

export const extractUaisRep = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
  const uais: Array<string> = [];
  const perdirOnUais = userInfo.FrEduRne?.map((item) => item.split("$")[0]) ?? [];

  if (userInfo.FrEduFonctAdm === "DIR") {
    if (perdirOnUais.length > 0) {
      uais.push(...perdirOnUais);
    }
  }

  if (perdirOnUais?.length > 0) {
    /**
     * Format des délégations : <nom appli>|<nom ressource>|<date debut>|<date fin>|<delegant>|<fredurneresp>|<id serveur>|<fonction deleguee>|
     * Les délégations ici présentes sont forcément des perdir puisque c'est spécifié dans le scope de demande
     * openId.
     * Il est aussi nécessaire de dé-dupliquer les entrées puisqu'elles peuvent correspondre à d'anciennes
     * délégations.
     * frEduRneResp est au format suivant : FrEduRneResp=UAI$UAJ$PU$N$T3$LP$320
     **/
    const delegations = uniq(
      flatten(
        // @ts-expect-error TODO
        userInfo?.FrEduResDel?.map((del) => {
          const frEduRneResp = del.split("|")[5];
          const startDate = dayjs(del.split("|")[2], "DD/MM/YYYY");
          const endDate = dayjs(del.split("|")[3], "DD/MM/YYYY");
          const now = dayjs();

          if (startDate.isBefore(now) && endDate.isAfter(now)) {
            const frEduRnes = frEduRneResp.replace("FrEduRneResp=", "");
            return frEduRnes.split(";").map((frEduRne) => frEduRne.split("$")[0]);
          }
        })
      ).filter((del) => {
        return del !== undefined;
      }) as unknown as Array<string>
    );

    if (delegations.length > 0) {
      uais.push(...delegations);
    }
  }
  return uais;
};

export const extractInfoFromLDAPGroups = (groups: Array<string>): {
  role?: Role,
  fonction?: UserFonction
} => {
  const orionGroups = groups.filter((group) => group.startsWith("GRP_ORIONIJ"));

  if (orionGroups.length === 0) {
    return {};
  }

  const roles = orionGroups.map((group) => {
    const roleDne = LDAP_GROUP_ROLES_DNE_CORRESPONDANCE[group as SupportedLDAPGroups];
    return ROLE_DNE_ROLE_ORION_CORRESPONDANCE[roleDne];
  });

  const fonctions = orionGroups.map((group) => {
    const roleDne = LDAP_GROUP_ROLES_DNE_CORRESPONDANCE[group as SupportedLDAPGroups];
    return ROLE_DNE_FONCTION_ORION_CORRESPONDANCE[roleDne];
  });

  const role = roles.find((r) => r !== undefined);
  const fonction = fonctions.find((f) => f !== undefined);

  return {
    role,
    fonction
  };
};

export const getUserRoleAttributes = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
  // Autres
  if (userInfo.ctgrps) {
    const { role, fonction } = extractInfoFromLDAPGroups(userInfo.ctgrps);

    if (role) {
      return {
        role,
        uais: undefined,
        fonction
      };
    }
  }

  // DASEN
  // Voir fiche polhab page 8
  if (userInfo.FrEduGestResp?.some(s => s.endsWith("805$ORIONINSERJEUNES"))) {
    return {
      role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE["DASEN"],
      uais: undefined,
      fonction: ROLE_DNE_FONCTION_ORION_CORRESPONDANCE["DASEN"]
    };
  }

  // Inspecteurs
  if (userInfo.title === RoleDNEEnum.INS) {
    return {
      role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE["INS"],
      uais: undefined,
      fonction: ROLE_DNE_FONCTION_ORION_CORRESPONDANCE["INS"]
    };
  }

  // Perdir
  if (userInfo.FrEduFonctAdm === "DIR" || userInfo.FrEduResDel) {
    const uais = extractUaisRep(userInfo);

    if (uais.length > 0) {
      return {
        role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE["PERDIR"],
        uais,
        fonction: ROLE_DNE_FONCTION_ORION_CORRESPONDANCE["PERDIR"]
      };
    } else {
      throw new Error(DneSSOErrorsEnum.MISSING_RIGHTS_PERDIR);
    }
  }

  return undefined;
};
