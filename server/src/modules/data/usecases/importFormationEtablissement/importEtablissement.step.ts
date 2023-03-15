import { DateTime } from "luxon";

import { dataDI } from "../../data.di";
import { Departement } from "../../entities/Departement";
import { Etablissement } from "../../entities/Etablissement";
import { LyceesACCELine } from "../../files/LyceesACCELine";
import { dependencies } from "./dependencies.di";
import { Logs } from "./types/Logs";

type DeppEtablissement = Awaited<
  ReturnType<typeof dataDI.inserJeunesApi.getUaiData>
>;
export const importEtablissementFactory =
  ({
    createEtablissement = dependencies.createEtablissement,
    findLyceeACCE = dependencies.findLyceeACCE,
    upsertIndicateurEtablissement = dependencies.upsertIndicateurEtablissement,
    findDepartement = dependencies.findDepartement,
  } = {}) =>
  async ({
    uai,
    deppMillesimeDatas,
  }: {
    uai: string;
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
  }): Promise<Logs> => {
    const lyceeACCE = await findLyceeACCE({ uai });

    const codeDepartement = formatCodeDepartement(
      lyceeACCE?.departement_insee_3
    );
    const departement =
      codeDepartement && (await findDepartement({ codeDepartement }));

    const etablissement = toEtablissement({
      uai,
      lyceeACCE,
      departement,
    });
    await createEtablissement(etablissement);

    for (const deppMillesimeData of deppMillesimeDatas) {
      const indicateur = getIndicateurEtablissement({
        deppEtablissement: deppMillesimeData.data,
        millesime: deppMillesimeData.millesime,
        uai,
      });
      if (!indicateur) continue;
      await upsertIndicateurEtablissement(indicateur);
    }
    return [];
  };

const formatCodeDepartement = (codeInsee: string | undefined) => {
  if (!codeInsee) return;
  if (codeInsee.length === 3) return codeInsee as `${number}${number}${string}`;
  if (codeInsee.length === 2)
    return `0${codeInsee}` as `${number}${number}${string}`;
};

const getIndicateurEtablissement = ({
  deppEtablissement,
  uai,
  millesime,
}: {
  deppEtablissement: DeppEtablissement;
  millesime: string;
  uai: string;
}) => {
  if (!deppEtablissement) return;
  return {
    UAI: uai,
    millesime,
    valeurAjoutee: deppEtablissement.ensemble?.valeur_ajoutee_6_mois,
  };
};

const toEtablissement = ({
  uai,
  lyceeACCE,
  departement,
}: {
  uai: string;
  lyceeACCE?: LyceesACCELine;
  departement?: Departement;
}): Omit<Etablissement, "id"> => {
  return {
    UAI: uai,
    siret: lyceeACCE?.numero_siren_siret_uai,
    codeAcademie: departement?.codeAcademie,
    codeRegion: departement?.codeRegion,
    codeDepartement: departement?.codeDepartement,
    natureUAI: lyceeACCE?.nature_uai,
    libelleEtablissement: lyceeACCE?.appellation_officielle,
    adresseEtablissement: lyceeACCE?.adresse_uai,
    commune: lyceeACCE?.commune,
    codePostal: lyceeACCE?.code_postal_uai,
    secteur: lyceeACCE?.secteur_public_prive,
    dateOuverture:
      lyceeACCE &&
      DateTime.fromFormat(lyceeACCE.date_ouverture, "dd/LL/yyyy").toJSDate(),
    dateFermeture: lyceeACCE?.date_fermeture
      ? DateTime.fromFormat(lyceeACCE.date_fermeture, "dd/LL/yyyy").toJSDate()
      : undefined,
    codeMinistereTutuelle: lyceeACCE?.ministere_tutelle,
  };
};
