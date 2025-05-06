import type { TypeAvisType } from "shared/enum/typeAvisEnum";
import type { UserFonction} from "shared/enum/userFonctionEnum";
import { UserFonctionEnum } from "shared/enum/userFonctionEnum";

export const FONCTIONS = {
  préalable: [
    UserFonctionEnum["Région"],
    UserFonctionEnum["Région académique"],
  ],
  consultatif: [
    UserFonctionEnum["Inspecteur"],
    UserFonctionEnum["DO CMQ"],
    UserFonctionEnum["Conseiller en formation professionnelle"],
    UserFonctionEnum["Coordonnateur de CFA-A"],
    UserFonctionEnum["DRAIO"],
    UserFonctionEnum["Services DOS"],
    UserFonctionEnum["DASEN"],
    UserFonctionEnum[ "Région"],
    UserFonctionEnum["DRAFPIC"],
    UserFonctionEnum["SGRA"],
    UserFonctionEnum["Recteur"],
  ],
  final: [
    UserFonctionEnum["Région"],
    UserFonctionEnum["CSA"],
    UserFonctionEnum["Recteur"]
  ],
} as Record<TypeAvisType, UserFonction[]>;
