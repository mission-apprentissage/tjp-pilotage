import { schema } from "../../../db/zapatos.schema";
import { Etablissement } from "../entities/Etablissement";
export const formatEtablissement = (
  etablissementDB: schema.etablissement.JSONSelectable
): Etablissement => {
  return (
    etablissementDB && {
      ...etablissementDB,
      codeAcademie: etablissementDB.codeAcademie ?? undefined,
      codeMinistereTutuelle: etablissementDB.codeMinistereTutuelle ?? undefined,
      libelleEtablissement: etablissementDB.libelleEtablissement ?? undefined,
      codePostal: etablissementDB.codePostal ?? undefined,
      commune: etablissementDB.commune ?? undefined,
      codeDepartement: etablissementDB.codeDepartement ?? undefined,
      codeRegion: etablissementDB.codeRegion ?? undefined,
      natureUAI: etablissementDB.natureUAI ?? undefined,
      secteur: etablissementDB.secteur ?? undefined,
      siret: etablissementDB.siret ?? undefined,
      adresseEtablissement: etablissementDB.adresseEtablissement ?? undefined,
      dateOuverture: etablissementDB.dateOuverture
        ? new Date(etablissementDB.dateOuverture)
        : undefined,
      dateFermeture: etablissementDB.dateFermeture
        ? new Date(etablissementDB.dateFermeture)
        : undefined,
    }
  );
};
