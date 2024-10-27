import Boom from "@hapi/boom";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import logger from "@/services/logger";

import { deleteSuiviQuery } from "./deps/deleteSuivi.query";
import { findOneSuiviQuery } from "./deps/findOneSuivi.query";

export const deleteSuiviFactory =
  (deps = { findOneIntention, findOneSuiviQuery, deleteSuiviQuery }) =>
  async ({ id, user }: { id: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
    const suivi = await deps.findOneSuiviQuery(id);
    if (!suivi) throw Boom.notFound("Suivi not found");

    const intention = await deps.findOneIntention(suivi.intentionNumero);
    if (!intention) throw Boom.notFound("Intention not found");
    const isAllowed = suivi.userId === user.id;
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteSuiviQuery(id);
    logger.info("Suivi supprimé", { id, suivi: suivi });
  };

export const deleteSuiviUsecase = deleteSuiviFactory();
