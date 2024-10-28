import Boom from "@hapi/boom";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { deleteSuiviQuery } from "./deps/deleteSuivi.query";
import { findOneSuiviQuery } from "./deps/findOneSuivi.query";

export const deleteSuiviFactory =
  (deps = { findOneIntention, findOneSuiviQuery, deleteSuiviQuery }) =>
  async ({
    id,
    user,
  }: {
    id: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
  }) => {
    const suivi = await deps.findOneSuiviQuery(id);
    if (!suivi) throw Boom.notFound("Suivi non trouvé en base");

    const intention = await deps.findOneIntention(suivi.intentionNumero);
    if (!intention) throw Boom.notFound("Intention non trouvée en base");
    const isAllowed = suivi.userId === user.id;
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteSuiviQuery(id);
    logger.info("Suivi supprimé", { id, suivi: suivi });
  };

export const deleteSuiviUsecase = deleteSuiviFactory();
