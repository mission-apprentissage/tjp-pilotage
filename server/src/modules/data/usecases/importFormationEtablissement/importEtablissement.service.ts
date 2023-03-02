import { DateTime } from "luxon";

import { dataDI } from "../../data.di";
import { Etablissement } from "../../entities/Etablissement";
import { LyceesACCELine } from "../../files/LyceesACCELine";
import { dependencies } from "./dependencies.di";

type DeppEtablissement = Awaited<
  ReturnType<typeof dataDI.inserJeunesApi.getUaiData>
>;
export const importEtablissementFactory =
  ({
    createEtablissement = dependencies.createEtablissement,
    findLyceeACCE = dependencies.findLyceeACCE,
    upsertIndicateurEtablissement = dependencies.upsertIndicateurEtablissement,
  } = {}) =>
  async ({
    uai,
    deppMillesimeDatas,
  }: {
    uai: string;
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
  }) => {
    const lyceeACCE = await findLyceeACCE({ uai });
    await createEtablissement(formatToEtablissement({ uai, lyceeACCE }));

    for (const deppMillesimeData of deppMillesimeDatas) {
      if (!deppMillesimeData.data) {
        continue;
      }

      const indicateur = {
        UAI: uai,
        millesime: deppMillesimeData.millesime,
        valeurAjoutee: deppMillesimeData.data.ensemble?.valeur_ajoutee_6_mois,
      };
      await upsertIndicateurEtablissement(indicateur);
    }
    return [];
  };

const formatToEtablissement = ({
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
