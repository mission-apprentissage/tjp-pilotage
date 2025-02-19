import * as Boom from "@hapi/boom";
import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import {getPermissionScope, RoleEnum} from 'shared';
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { DB } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";

export const isDemandeSelectable =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "demande">) => {
      const filters = getDemandeSelectableFilters(user);

      if(filters.role === RoleEnum["invite"]) return eb
        .and([
          filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
          eb("demande.statut", "in", [DemandeStatutEnum["demande validée"], DemandeStatutEnum["refusée"]]),
        ]);

      return eb.and([
        filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
        filters.uais ? eb("demande.uai", "in", filters.uais) : sql<boolean>`true`,
      ]);
    };

const getDemandeSelectableFilters = (user?: RequestUser) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, "intentions/lecture");
  if (!scope) throw Boom.forbidden();

  return {
    national: {},
    région: { codeRegion: user.codeRegion },
    user: { userId: user.id },
    uai: { uais: user.uais ?? [] },
    role: { role: user.role, codeRegion: user.codeRegion },
  }[scope];
};

export const isDemandeNotDeleted = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "!=", DemandeStatutEnum["supprimée"]);

export const isDemandeNotDeletedOrRefused = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "not in", [DemandeStatutEnum["supprimée"], DemandeStatutEnum["refusée"]]);

export const isDemandeNotAjustementRentree = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.typeDemande", "not in", ["ajustement"]);

export const isIntentionBrouillonVisible =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "intention">) => {
      return eb.or([
        eb.and([eb("intention.statut", "=", DemandeStatutEnum["brouillon"]), eb("intention.createdBy", "=", user.id)]),
        eb("intention.statut", "!=", DemandeStatutEnum["brouillon"]),
      ]);
    };

export const isIntentionSelectable =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "intention">) => {
      const filters = getIntentionSelectableFilters(user);

      if(filters.role === RoleEnum["invite"]) return eb
        .and([
          filters.codeRegion ? eb("intention.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
          eb("intention.statut", "in", [DemandeStatutEnum["demande validée"], DemandeStatutEnum["refusée"]]),
        ]);

      return eb.and([
        filters.codeRegion ? eb("intention.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
        filters.uais ? eb("intention.uai", "in", filters.uais) : sql<boolean>`true`,
      ]);
    };

const getIntentionSelectableFilters = (user?: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, "intentions-perdir/lecture");
  if (!scope) throw Boom.forbidden();

  return {
    national: {},
    région: { codeRegion: user.codeRegion },
    uai: { uais: user.uais },
    role: { role: user.role, codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope];
};

export const isIntentionNotDeleted = (eb: ExpressionBuilder<DB, "intention">) =>
  eb("intention.statut", "!=", DemandeStatutEnum["supprimée"]);

export const isIntentionNotDeletedOrRefused = (eb: ExpressionBuilder<DB, "intention">) =>
  eb("intention.statut", "not in", [DemandeStatutEnum["supprimée"], DemandeStatutEnum["refusée"]]);
