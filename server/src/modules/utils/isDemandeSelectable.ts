import * as Boom from "@hapi/boom";
import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { getPermissionScope, hasRole, RoleEnum } from 'shared';
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { PermissionEnum } from 'shared/enum/permissionEnum';

import type { DB } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";

export const isDemandeNotDeleted = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "!=", DemandeStatutEnum["supprimée"]);

export const isDemandeNotDeletedOrRefused = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "not in", [DemandeStatutEnum["supprimée"], DemandeStatutEnum["refusée"]]);

export const isDemandeNotAjustementRentree = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.typeDemande", "not in", ["ajustement"]);

export const isDemandeBrouillonVisible =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "demande">) => {
      return eb.or([
        eb.and([
          eb("demande.statut", "=", DemandeStatutEnum["brouillon"]),
          (user.uais && user.uais.length > 0) ? eb("demande.uai", "in", user.uais) : eb("demande.createdBy", "=", user.id),
        ]),
        eb("demande.statut", "!=", DemandeStatutEnum["brouillon"]),
      ]);
    };

export const isDemandeSelectable =
  ({ user }: { user: RequestUser }) =>
    (eb: ExpressionBuilder<DB, "demande">) => {
      const filters = getDemandeSelectableFilters(user);

      if (hasRole({ user, role: RoleEnum["invite"] })) return eb
        .and([
          filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
          eb("demande.statut", "in", [
            DemandeStatutEnum["demande validée"],
            DemandeStatutEnum["refusée"]]),
        ]);

      if (hasRole({ user, role: RoleEnum["region"] })) return eb
        .and([
          filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
          eb("demande.statut", "in", [
            DemandeStatutEnum["dossier complet"],
            DemandeStatutEnum["projet de demande"],
            DemandeStatutEnum["prêt pour le vote"],
            DemandeStatutEnum["demande validée"],
            DemandeStatutEnum["refusée"],
          ]),
        ]);

      return eb.and([
        filters.codeRegion ? eb("demande.codeRegion", "=", filters.codeRegion) : sql<boolean>`true`,
        filters.uais ? eb("demande.uai", "in", filters.uais) : sql<boolean>`true`,
      ]);
    };

const getDemandeSelectableFilters = (user?: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, PermissionEnum["demande/lecture"]);
  if (!scope) throw Boom.forbidden();

  return {
    national: {},
    région: { codeRegion: user.codeRegion },
    uai: { uais: (user.uais && user.uais.length > 0) ? user.uais : undefined },
    role: { role: user.role, codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope];
};
