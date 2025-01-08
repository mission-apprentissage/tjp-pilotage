import Boom from "@hapi/boom";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemande } from "@/modules/demandes/repositories/findOneDemande.query";

import { deleteSuiviQuery } from "./deps/deleteSuivi.query";
import { findOneSuiviQuery } from "./deps/findOneSuivi.query";

export const deleteSuiviFactory =
  (deps = { findOneDemande, findOneSuiviQuery, deleteSuiviQuery }) =>
  async ({ id, user }: { id: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
    const suivi = await deps.findOneSuiviQuery(id);
    if (!suivi) throw Boom.notFound("Suivi non trouvé en base");

    const intention = await deps.findOneDemande(suivi.intentionNumero);
    if (!intention) throw Boom.notFound("Demande non trouvée en base");
    const isAllowed = suivi.userId === user.id;
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteSuiviQuery(id);
  };

export const deleteSuiviUsecase = deleteSuiviFactory();
