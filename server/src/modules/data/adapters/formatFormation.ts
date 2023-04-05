import { schema } from "../../../db/zapatos.schema";
import { Formation } from "../entities/Formation";

export const formatFormation = (
  formation: schema.formation.JSONSelectable
): Formation => ({
  ...formation,
  rncp: formation.rncp ?? undefined,
  dateOuverture: new Date(formation.dateOuverture),
  dateFermeture: formation.dateFermeture
    ? new Date(formation.dateFermeture)
    : undefined,
});
