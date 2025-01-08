import type { TypeFormationSpecifiqueType } from "shared/enum/formationSpecifiqueEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

export const formatFormationSpecifique = (
  formation: Record<Partial<TypeFormationSpecifiqueType>, string | boolean | undefined | null>,
) => ({
  [TypeFormationSpecifiqueEnum["Action prioritaire"]]:
    TypeFormationSpecifiqueEnum["Action prioritaire"] in formation
      ? !!formation[TypeFormationSpecifiqueEnum["Action prioritaire"]]
      : false,
  [TypeFormationSpecifiqueEnum["Transition démographique"]]:
    TypeFormationSpecifiqueEnum["Transition démographique"] in formation
      ? !!formation[TypeFormationSpecifiqueEnum["Transition démographique"]]
      : false,
  [TypeFormationSpecifiqueEnum["Transition écologique"]]:
    TypeFormationSpecifiqueEnum["Transition écologique"] in formation
      ? !!formation[TypeFormationSpecifiqueEnum["Transition écologique"]]
      : false,
  [TypeFormationSpecifiqueEnum["Transition numérique"]]:
    TypeFormationSpecifiqueEnum["Transition numérique"] in formation
      ? !!formation[TypeFormationSpecifiqueEnum["Transition numérique"]]
      : false,
});
