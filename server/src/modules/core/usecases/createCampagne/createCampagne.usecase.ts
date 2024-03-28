import Boom from "@hapi/boom";
import { inject } from "injecti";

import { BodySchema } from "./createCampagne.schema";
import { insertCampagne } from "./deps/createCampagne.dep";
import { getSimilarCampagne } from "./deps/getSimilarCampagne.dep";

export const [createCampagne, createCampagneFactory] = inject(
  {
    insertCampagne,
    getSimilarCampagne,
  },
  (deps) => async (campagne: BodySchema) => {
    const existingCampagne = await deps.getSimilarCampagne({ data: campagne });
    if (existingCampagne) throw Boom.badRequest("Campagne already exist");
    await insertCampagne({
      data: campagne,
    });
  }
);
