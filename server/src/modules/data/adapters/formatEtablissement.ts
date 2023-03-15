import { schema } from "../../../db/zapatos.schema";
import { cleanNull } from "../../../utils/noNull";
import { Etablissement } from "../entities/Etablissement";
export const formatEtablissement = (
  etablissementDB: schema.etablissement.JSONSelectable
): Etablissement => {
  return cleanNull({
    ...etablissementDB,
    dateOuverture: etablissementDB.dateOuverture
      ? new Date(etablissementDB.dateOuverture)
      : undefined,
    dateFermeture: etablissementDB.dateFermeture
      ? new Date(etablissementDB.dateFermeture)
      : undefined,
  });
};
