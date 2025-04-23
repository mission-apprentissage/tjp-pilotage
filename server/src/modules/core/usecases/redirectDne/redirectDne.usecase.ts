import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { inject } from "injecti";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { flatten, uniq } from "lodash-es";
import type { UserinfoResponse } from "openid-client";
import type {Role} from 'shared';
import {RoleEnum} from 'shared';
import { DneSSOErrorsEnum } from "shared/enum/dneSSOErrorsEnum";
import type { SupportedLDAPGroups } from "shared/security/sso";
import { LDAP_GROUP_ROLES_DNE_CORRESPONDANCE, ROLE_DNE_ROLE_ORION_CORRESPONDANCE,RoleDNEEnum } from "shared/security/sso";

import config from "@/config";
import { getDneClient } from "@/modules/core/services/dneClient/dneClient";
import logger from "@/services/logger";

import { createUserInDB } from "./createUser.dep";
import { findEtablissement } from "./findEtablissement.dep";
import { findRegionFromAcademie } from "./findRegionFromAcademie.dep";
import { findUserQuery } from "./findUserQuery.dep";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(customParseFormat);

type ExtraUserInfo = {
  FrEduFonctAdm?: string;
  FrEduRne?: Array<string>;
  FrEduResDel?: Array<string>;
  FrEduRneResp?: Array<string>;
  // Liste des groupes LDAP auxquels l'utilisateur est rattaché
  ctgrps?: Array<string>;
  // Titre de fonction de l'utilisateur
  title?: string;
  // Nécessaire à l'identification du DASEN
  FrEduGestResp?: string;
  // Code région académique
  codaca?:string;
};

type TUserEtablissement = {
  codeRegion: string | null;
  uai: string;
} | undefined

const extractUaisRep = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
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

const extractRoleFromLDAPGroups = (groups: Array<string>): Role | undefined => {
  const orionGroups = groups.filter((group) => group.startsWith("GRP_ORION"));

  if (orionGroups.length === 0) {
    return;
  }

  const roles = orionGroups.map((group) => {
    const roleDne = LDAP_GROUP_ROLES_DNE_CORRESPONDANCE[group as SupportedLDAPGroups];
    return ROLE_DNE_ROLE_ORION_CORRESPONDANCE[roleDne];
  });

  return roles.find((role) => role !== undefined);
};

const getUserRoleAttributes = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
  // Autres
  if (userInfo.ctgrps) {
    const role = extractRoleFromLDAPGroups(userInfo.ctgrps);

    if (role) {
      return {
        role,
        uais: []
      };
    }
  }

  // DASEN
  // Voir fiche polhab page 8
  if (userInfo.FrEduGestResp?.endsWith("805$ORIONINSERJEUNES")) {
    return {
      role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE["DASEN"],
      uais: []
    };
  }

  // Inspecteurs
  if (userInfo.title === RoleDNEEnum.INS) {
    return {
      role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE["INS"],
      uais: []
    };
  }

  // Perdir
  if (userInfo.FrEduFonctAdm === "DIR" || userInfo.FrEduResDel) {
    const uais = extractUaisRep(userInfo);

    if (uais.length > 0) {
      return {
        role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE["PERDIR"],
        uais,
      };
    }
  }

  return undefined;
};

const decodeCodeVerifierJwt = (token: string, secret: string) => {
  try {
    const decoded = (jwt.verify(token, secret) ?? {}) as {
      code_verifier: string;
    };
    if (decoded.code_verifier) {
      return decoded.code_verifier;
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (_e) {
    throw new Error("wrong codeVerifierJwt");
  }
  throw new Error("missing codeVerifierJwt");
};

export const [redirectDne, redirectDneFactory] = inject(
  {
    codeVerifierJwtSecret: config.dne.codeVerifierJwt,
    authJwtSecret: config.auth.authJwtSecret,
    getDneClient,
    findUserQuery,
    createUserInDB,
    findEtablissement,
    findRegionFromAcademie
  },
  (deps) =>
    async ({ codeVerifierJwt, url }: { codeVerifierJwt: string; url: string }) => {
      const code_verifier = decodeCodeVerifierJwt(codeVerifierJwt, deps.codeVerifierJwtSecret);

      if (!code_verifier) throw new Error(DneSSOErrorsEnum.MISSING_CODE_VERIFIER);

      const client = await deps.getDneClient().catch((err) => {
        logger.error({ error: err }, "[SSO] Erreur lors de la récupération du client");
        throw new Error(DneSSOErrorsEnum.FAILURE_ON_DNE_REDIRECT);
      });

      const params = client.callbackParams(url);
      const tokenSet = await client.callback(config.dne.redirectUri, params, {
        code_verifier,
      }).catch((err) => {
        logger.error({ error: err }, "[SSO] Erreur lors de la récupération du token");
        throw new Error(DneSSOErrorsEnum.MISSING_ACCESS_TOKEN);
      });

      if (!tokenSet.access_token) throw new Error(DneSSOErrorsEnum.MISSING_ACCESS_TOKEN);

      const userinfo = await client.userinfo<ExtraUserInfo>(tokenSet.access_token).catch((err) => {
        logger.error({ error: err }, "[SSO] Erreur lors de la récupération du userinfo");
        throw new Error(DneSSOErrorsEnum.MISSING_USERINFO);
      });

      if (!userinfo) throw new Error(DneSSOErrorsEnum.MISSING_USERINFO);

      logger.info(
        {
          userinfo,
        },
        "[SSO] Userinfo"
      );

      const email = userinfo.email?.toLowerCase();
      if (!email) {
        logger.error({
          error: new Error(DneSSOErrorsEnum.MISSING_USER_EMAIL),
          userinfo,
        }, "[SSO] Il manque l'email de l'utilisateur");
        throw new Error(DneSSOErrorsEnum.MISSING_USER_EMAIL);
      }

      const user = await deps.findUserQuery(email);
      if (user && !user.enabled) {
        logger.error({
          error: new Error(DneSSOErrorsEnum.USER_NOT_ENABLED),
          userinfo,
          email,
        }, "[SSO] L'utilisateur existe et est désactivé");
        throw new Error(DneSSOErrorsEnum.USER_NOT_ENABLED);
      }

      const attributes = getUserRoleAttributes(userinfo);
      if (!attributes) {
        logger.error({
          error: new Error(DneSSOErrorsEnum.MISSING_RIGHTS),
          userinfo,
          email,
        }, "[SSO] Aucun droit n'a pu être extrait pour l'utilisateur");
        throw new Error(DneSSOErrorsEnum.MISSING_RIGHTS);
      }

      logger.info(
        {
          email,
          user,
          attributes,
        },
        "[SSO] Attributs utilisateur"
      );

      let etablissement: TUserEtablissement = undefined;
      if (attributes.role === RoleEnum.perdir && attributes.uais.length > 0) {
        etablissement = attributes.uais && (await deps.findEtablissement({ uais: attributes.uais }));
      }

      if (attributes.role === RoleEnum.perdir && !etablissement?.codeRegion) {
        logger.error({
          error: new Error(DneSSOErrorsEnum.MISSING_CODE_REGION_PERDIR),
          userinfo,
          email,
          attributes,
          etablissement,
        }, "[SSO] Établissement non trouvé pour un utilisateur perdir");
        throw new Error(DneSSOErrorsEnum.MISSING_CODE_REGION_PERDIR);
      }

      let codeRegion: string | null | undefined;
      const userNeedsCodeRegion = ["admin_region", "pilote_region", "gestionnaire_region", "expert_region"].includes(attributes.role);

      try {
        // Si l'utilisateur est un perdir, extraire le codeRegions des UAI contenu dans les attributes
        if (attributes.role === RoleEnum.perdir) {
          if (etablissement) {
            codeRegion = etablissement?.codeRegion;
          }
          // Si l'utilisateur a besoin d'un codeRegion et qu'il n'est pas un perdir,
          // Aller chercher le codeRegion depuis le codeAca
        } else if (userNeedsCodeRegion && userinfo.codaca) {
          const codeRegionFromAcademie = await deps.findRegionFromAcademie(userinfo.codaca.substring(1));
          if (codeRegionFromAcademie) {
            codeRegion = codeRegionFromAcademie.codeRegion;
          } else {
            logger.error({
              userinfo,
              email,
              attributes,
            }, "[SSO] Le code région n'a pas pu être déduit du codaca");
            throw new Error(DneSSOErrorsEnum.MISSING_CODE_REGION_CODACA);
          }
        }
      } catch (err) {
        // Cela signifie que c'est une erreur logicielle et non utilisateur
        if ((err as Error).message !== DneSSOErrorsEnum.MISSING_CODE_REGION_CODACA) {
          logger.error({
            error: err,
            userinfo,
            email,
            attributes,
          }, "[SSO] Une erreur est survenue lors de la récupération du code région");
        }
        // Si l'utilisateur n'a pas de code région, on ne l'insère pas en base de données
        throw new Error(DneSSOErrorsEnum.MISSING_CODE_REGION_CODACA);
      }

      const userToInsert = {
        ...user,
        email,
        firstname: userinfo.given_name,
        lastname: userinfo.family_name,
        sub: userinfo.sub,
        codeRegion: codeRegion,
        enabled: true,
        ...attributes,
        // On garde par défaut le role de l'utilisateur s'il existe déjà en base de données
        role: user ? user.role : attributes.role as Role,
      };

      await deps.createUserInDB({ user: userToInsert });

      if (user) {
        logger.info(
          {
            user: userToInsert,
            userinfo,
          },
          `[SSO] Nouveau login`
        );
      } else {
        logger.info(
          {
            user: userToInsert,
            userinfo,
          },
          `[SSO] Nouvel utilisateur DNE`
        );
      }

      const authorizationToken = jwt.sign({ email }, deps.authJwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });

      return { token: authorizationToken, user: userToInsert };
    }
);
