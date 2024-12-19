import { z } from "zod";

import { TypeFormationSpecifiqueEnum } from "../enum/formationSpecifiqueEnum";

export const FormationSpecifiqueFlagsSchema = z.object({
  [TypeFormationSpecifiqueEnum["Action prioritaire"]]: z.coerce.boolean().optional(),
  [TypeFormationSpecifiqueEnum["Transition écologique"]]: z.coerce.boolean().optional(),
  [TypeFormationSpecifiqueEnum["Transition démographique"]]: z.coerce.boolean().optional(),
  [TypeFormationSpecifiqueEnum["Transition numérique"]]: z.coerce.boolean().optional(),
});
