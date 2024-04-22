import Boom from "@hapi/boom";
import { ExpressionBuilder, sql } from "kysely";
import { getPermissionScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB } from "../../db/db";
import { RequestUser } from "../core/model/User";

export const isDemandeSelectable =
  ({ user }: { user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) =>
  (eb: ExpressionBuilder<DB, "demande">) => {
    const { filter, draftFilter } = getDemandeSelectableFilters(user);
    return eb.or([
      eb.and([
        eb("demande.statut", "=", DemandeStatutEnum.draft),
        draftFilter.userId
          ? eb("demande.createurId", "=", draftFilter.userId)
          : sql<boolean>`true`,
        draftFilter.codeRegion
          ? eb("demande.codeRegion", "=", draftFilter.codeRegion)
          : sql<boolean>`true`,
      ]),
      eb.and([
        eb("demande.statut", "!=", DemandeStatutEnum.draft),
        filter.codeRegion
          ? eb("demande.codeRegion", "=", filter.codeRegion)
          : sql<boolean>`true`,
      ]),
    ]);
  };

const getDemandeSelectableFilters = (
  user?: Pick<RequestUser, "id" | "role" | "codeRegion">
) => {
  if (!user) throw new Error("missing variable user");
  const scope = getPermissionScope(user?.role, "intentions/lecture");
  if (!scope?.draft) throw Boom.forbidden();

  const draftFilter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope?.draft];

  const filter = {
    national: {},
    region: { codeRegion: user.codeRegion },
    user: { userId: user.id },
  }[scope?.default];

  return { filter, draftFilter };
};

export const isDemandeNotDeleted = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "!=", DemandeStatutEnum.deleted);

export const isDemandeNotDeletedOrRefused = (
  eb: ExpressionBuilder<DB, "demande">
) =>
  eb("demande.statut", "not in", [
    DemandeStatutEnum.deleted,
    DemandeStatutEnum.refused,
  ]);

export const isIntentionSelectable =
  ({ user }: { user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) =>
  (eb: ExpressionBuilder<DB, "intention">) => {
    const { filter, draftFilter } = getIntentionSelectableFilters(user);
    return eb.or([
      eb.and([
        eb("intention.statut", "=", DemandeStatutEnum.draft),
        draftFilter.uais
          ? eb.or(draftFilter.uais.map((uai) => eb("intention.uai", "=", uai)))
          : sql<boolean>`true`,
        draftFilter.codeRegion
          ? eb("intention.codeRegion", "=", draftFilter.codeRegion)
          : sql<boolean>`true`,
      ]),
      eb.and([
        eb("intention.statut", "!=", DemandeStatutEnum.draft),
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
  eb("intention.statut", "!=", DemandeStatutEnum.deleted);

export const isIntentionNotDeletedOrRefused = (
  eb: ExpressionBuilder<DB, "intention">
) =>
  eb("intention.statut", "not in", [
    DemandeStatutEnum.deleted,
    DemandeStatutEnum.refused,
  ]);
