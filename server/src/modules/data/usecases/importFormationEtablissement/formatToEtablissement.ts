import { DateTime } from "luxon";

import { Etablissement } from "../../entities/Etablissement";
import { LyceesACCELine } from "../../files/LyceesACCELine";
export const formatToEtablissement = ({
  uai,
  lyceeACCE,
}: {
  uai: string;
  lyceeACCE?: LyceesACCELine;
}): Omit<Etablissement, "id"> => ({
  UAI: uai,
  siret: lyceeACCE?.numero_siren_siret_uai,
  codeAcademie: lyceeACCE?.academie,
  natureUAI: lyceeACCE?.nature_uai,
  libelleEtablissement: lyceeACCE?.appellation_officielle,
  adresseEtablissement: lyceeACCE?.adresse_uai,
  codePostal: lyceeACCE?.code_postal_uai,
  secteur: lyceeACCE?.secteur_public_prive,
  dateOuverture:
    lyceeACCE &&
    DateTime.fromFormat(lyceeACCE.date_ouverture, "dd/LL/yyyy").toJSDate(),
  dateFermeture: lyceeACCE?.date_fermeture
    ? DateTime.fromFormat(lyceeACCE.date_fermeture, "dd/LL/yyyy").toJSDate()
    : undefined,
  codeMinistereTutuelle: lyceeACCE?.ministere_tutelle,
});
