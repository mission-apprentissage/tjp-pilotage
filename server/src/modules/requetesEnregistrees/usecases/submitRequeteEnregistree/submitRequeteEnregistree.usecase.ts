import Boom from "@hapi/boom";
import { inject } from "injecti";
import type { submitRequeteEnregistreeSchema } from "shared/routes/schemas/post.requete.enregistrement.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneSimilarRequeteEnregistreeQuery } from "@/modules/requetesEnregistrees/repositories/findOneSimilarRequeteEnregistree.query";

import { createRequeteEnregistree } from "./dependencies/createRequeteEnregistree.dep";

type RequeteEnregistree = z.infer<typeof submitRequeteEnregistreeSchema.body>;

export const [submitRequeteEnregistreeUsecase, submitRequeteEnregistreeFactory] = inject(
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
      const requeteEnregistreeVide = Object.keys(requeteEnregistree.filtres).length === 0;

      if (requeteEnregistreeVide) {
        throw Boom.badRequest("Requête enregistrée vide", {
          errors: {
            empty_requete:
              "La requête enregistrée ne peut pas être vide. Choisissez des filtres pour enregistrer une requête.",
          },
        });
      }

      const requeteEnregistreeExistante = await findOneSimilarRequeteEnregistreeQuery({
        ...requeteEnregistree,
        userId: user.id,
      });

      if (requeteEnregistreeExistante)
        throw Boom.badRequest("Requête enregistrée existante", {
          id: requeteEnregistreeExistante.id,
          errors: {
            same_requete: "Une requête enregistrée similaire existe avec ces mêmes champs: nom, couleur, page.",
          },
        });

      const createdSuivi = await deps.createRequeteEnregistree({
        ...requeteEnregistree,
        userId: user.id,
        filtres: JSON.stringify(requeteEnregistree.filtres),
      });

      return createdSuivi;
    },
);
