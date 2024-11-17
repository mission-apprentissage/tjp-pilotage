import Boom from "@hapi/boom";
import { ExpressionBuilder, sql } from "kysely";
import { getPermissionScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB } from "../../db/db";
import { RequestUser } from "../core/model/User";

export const isDemandeSelectable =
  ({ user }: { user: RequestUser }) =>
  (eb: ExpressionBuilder<DB, "demande">) => {
    const { filter, draftFilter } = getDemandeSelectableFilters(user);

    return eb.or([
      eb.and([
        eb("demande.statut", "=", DemandeStatutEnum["proposition"]),
        draftFilter.codeRegion
          ? eb("demande.codeRegion", "=", draftFilter.codeRegion)
          : sql<boolean>`true`,
        draftFilter.role == "invite" ? sql<boolean>`false` : sql<boolean>`true`,
      ]),
      eb.and([
        eb("demande.statut", "!=", DemandeStatutEnum["proposition"]),
        filter.codeRegion
          ? eb("demande.codeRegion", "=", filter.codeRegion)
          : sql<boolean>`true`,
        filter.uais ? eb("demande.uai", "in", filter.uais) : sql<boolean>`true`,
        filter.role === "invite" ? sql<boolean>`false` : sql<boolean>`true`,
      ]),
      eb.and([
        filter.role === "invite" ? sql<boolean>`true` : sql<boolean>`false`,
        filter.codeRegion
          ? eb("demande.codeRegion", "=", filter.codeRegion)
          : sql<boolean>`true`,
        eb("demande.statut", "in", [
          DemandeStatutEnum["demande validée"],
          DemandeStatutEnum["refusée"],
        ]),
      ]),
    ]);
  };

const getDemandeSelectableFilters = (user?: RequestUser) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, "intentions/lecture");
  if (!scope?.draft) throw Boom.forbidden();

  const draftFilter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: { userId: user.id },
    uai: { uais: user.uais ?? [] },
    role: { role: user.role, codeRegion: user.codeRegion },
  }[scope?.draft];

  const filter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: { userId: user.id },
    uai: { uais: user.uais ?? [] },
    role: { role: user.role, codeRegion: user.codeRegion },
  }[scope?.default];

  return { filter, draftFilter };
};

export const isDemandeNotDeleted = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "!=", DemandeStatutEnum["supprimée"]);

export const isDemandeNotDeletedOrRefused = (
  eb: ExpressionBuilder<DB, "demande">
) =>
  eb("demande.statut", "not in", [
    DemandeStatutEnum["supprimée"],
    DemandeStatutEnum["refusée"],
  ]);

export const isDemandeNotAjustementRentree = (
  eb: ExpressionBuilder<DB, "demande">
) => eb("demande.typeDemande", "not in", ["ajustement"]);

export const isIntentionBrouillonVisible =
  ({ user }: { user: RequestUser }) =>
  (eb: ExpressionBuilder<DB, "intention">) => {
    return eb.or([
      eb.and([
        eb("intention.statut", "=", DemandeStatutEnum["brouillon"]),
        eb("intention.createdBy", "=", user.id),
      ]),
      eb("intention.statut", "!=", DemandeStatutEnum["brouillon"]),
    ]);
  };

export const isIntentionSelectable =
  ({ user }: { user: RequestUser }) =>
  (eb: ExpressionBuilder<DB, "intention">) => {
    const { filter, draftFilter } = getIntentionSelectableFilters(user);
    return eb.or([
      eb.and([
        eb("intention.statut", "=", DemandeStatutEnum["proposition"]),
        draftFilter.uais
          ? eb.or(draftFilter.uais.map((uai) => eb("intention.uai", "=", uai)))
          : sql<boolean>`true`,
        draftFilter.codeRegion
          ? eb("intention.codeRegion", "=", draftFilter.codeRegion)
          : sql<boolean>`true`,
      ]),
      eb.and([
        eb("intention.statut", "!=", DemandeStatutEnum["proposition"]),
        filter.uais
          ? eb.or(filter.uais.map((uai) => eb("intention.uai", "=", uai)))
          : sql<boolean>`true`,
        filter.codeRegion
          ? eb("intention.codeRegion", "=", filter.codeRegion)
          : sql<boolean>`true`,
      ]),
    ]);
  };

const getIntentionSelectableFilters = (
  user?: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">
) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, "intentions-perdir/lecture");
  if (!scope?.draft) throw Boom.forbidden();

  const draftFilter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    uai: { uais: user.uais },
  }[scope?.draft];

  const filter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    uai: { uais: user.uais },
  }[scope?.default];

  return { filter, draftFilter };
};

export const isIntentionNotDeleted = (eb: ExpressionBuilder<DB, "intention">) =>
  eb("intention.statut", "!=", DemandeStatutEnum["supprimée"]);

export const isIntentionNotDeletedOrRefused = (
  eb: ExpressionBuilder<DB, "intention">
) =>
  eb("intention.statut", "not in", [
    DemandeStatutEnum["supprimée"],
    DemandeStatutEnum["refusée"],
  ]);
