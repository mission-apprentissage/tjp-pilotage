/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import type { Role } from 'shared';
import { RoleEnum } from 'shared';
import { DneSSOErrorsEnum } from "shared/enum/dneSSOErrorsEnum";

import config from "@/config";
import { getDneClient } from "@/modules/core/services/dneClient/dneClient";
import logger from "@/services/logger";
import { inject } from "@/utils/inject";

import { createUserInDB } from "./createUser.dep";
import { findEtablissement } from "./findEtablissement.dep";
import { findRegionFromAcademie } from "./findRegionFromAcademie.dep";
import { findUserQuery } from "./findUserQuery.dep";
import type { ExtraUserInfo, TUserEtablissement } from "./types";
import { generateUserCommunication, getUserRoleAttributes } from "./utils";



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
          // Cela signifie que le codaca n'est pas défini pour l'utilisateur
          if (userinfo.codaca === "000") {
            logger.error({
              userinfo,
              email,
              attributes,
            }, "[SSO] Le code région n'a pas pu être déduit du codaca");
            throw new Error(DneSSOErrorsEnum.MISSING_CODE_REGION_CODACA);
          }

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
        email: email,
        firstname: userinfo.given_name,
        lastname: userinfo.family_name,
        sub: userinfo.sub,
        codeRegion: codeRegion,
        enabled: true,
        // Si l'utilisateur a un mot de passe, nous le supprimons pour éviter la possible double connexion
        // DNE + Local
        password: null,
        ...attributes,
        // On garde par défaut le role de l'utilisateur s'il existe déjà en base de données
        role: (user && user.role) ? user.role : attributes.role as Role,
        // On garde par défaut la fonction de l'utilisateur s'il existe déjà en base de données
        fonction: (user && user.fonction) ? user.fonction : (attributes.fonction ?? null)
      };

      await deps.createUserInDB({ user: userToInsert });

      logger.info(
        {
          user: userToInsert,
          userinfo,
        },
        user ? `[SSO] Nouveau login` :
          `[SSO] Nouvel utilisateur DNE`
      );

      const authorizationToken = jwt.sign({ email }, deps.authJwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });

      return {
        token: authorizationToken, user: userToInsert, userCommunication: generateUserCommunication({
          passwordDeleted: user?.password !== undefined && user?.password !== null && user?.password !== "",
          userCreated: !user,
        })
      };
    }
);
