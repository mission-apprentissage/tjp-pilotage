import Boom from "@hapi/boom";
import { inject } from "injecti";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { findOneSimilarRequeteEnregistreeQuery } from "../../repositories/findOneSimilarRequeteEnregistree.query";
import { createRequeteEnregistree } from "./dependencies/createRequeteEnregistree.dep";
import { submitRequeteEnregistreeSchema } from "./submitRequeteEnregistree.schema";

type RequeteEnregistree = z.infer<typeof submitRequeteEnregistreeSchema.body>;

export const [
  submitRequeteEnregistreeUsecase,
  submitRequeteEnregistreeFactory,
] = inject(
  {
    createRequeteEnregistree,
    findOneSimilarRequeteEnregistreeQuery,
  },
  (deps) =>
    async ({
      user,
      requeteEnregistree,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      requeteEnregistree: RequeteEnregistree;
    }) => {
      const requeteEnregistreeExistante =
        await findOneSimilarRequeteEnregistreeQuery({
          ...requeteEnregistree,
          userId: user.id,
        });

      if (requeteEnregistreeExistante)
        throw Boom.badRequest("Requête enregistrée existante", {
          id: requeteEnregistreeExistante.id,
          errors: {
            same_requete:
              "Une requête enregistrée similaire existe avec ces mêmes champs: nom, couleur, page.",
          },
        });

      const createdSuivi = await deps.createRequeteEnregistree({
        ...requeteEnregistree,
        userId: user.id,
        filtres: JSON.stringify(requeteEnregistree.filtres),
      });

      return createdSuivi;
    }
);
