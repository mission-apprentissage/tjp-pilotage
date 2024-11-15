import Boom from "@hapi/boom";

import { RequestUser } from "../../../core/model/User";
import { findOneRequeteEnregistreeQuery } from "../../repositories/findOneRequeteEnregistree.query";
import { deleteRequeteEnregistreeQuery } from "./deps/deleteRequeteEnregistree.dep";

export const deleteRequeteEnregistreeFactory =
  (
    deps = {
      findOneRequeteEnregistreeQuery,
      deleteRequeteEnregistreeQuery,
    }
  ) =>
  async ({
    id,
    user,
  }: {
    id: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
  }) => {
    const requeteEnregistree = await deps.findOneRequeteEnregistreeQuery(id);
    if (!requeteEnregistree)
      throw Boom.notFound("Requête enregistrée non trouvée");

    const isAllowed = requeteEnregistree.userId === user.id;
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteRequeteEnregistreeQuery(id);
  };

export const deleteRequeteEnregistreeUsecase =
  deleteRequeteEnregistreeFactory();
