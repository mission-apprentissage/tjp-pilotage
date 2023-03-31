import { dataDI } from "../../../data.di";
import { IndicateurEntree } from "../../../entities/IndicateurEntree";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { dependencies } from "../dependencies.di";
import { logger } from "../importLogger";
import { getIndicateursAffelnetFactory } from "./getIndicateurAffelnet.step";

export const importIndicateurEntreeFactory = ({
  createIndicateurEntree = dependencies.createIndicateurEntree,
  findRawData = dataDI.rawDataRepository.findRawData,
  getIndicateursAffelnet = getIndicateursAffelnetFactory(),
} = {}) => {
  return async ({
    formationEtablissementId,
    uai,
    mefstat11FirstYear,
    libelleDebut,
    isSpecialite,
  }: {
    formationEtablissementId: string;
    uai: string;
    mefstat11FirstYear: string;
    libelleDebut: string;
    isSpecialite: boolean;
  }) => {
    const cab_nbre_division_effectifs_par_etab_mefst11 = await findRawData({
      type: "Cab-nbre_division_effectifs_par_etab_mefst11",
      filter: {
        "Mef Bcp 11": mefstat11FirstYear,
        "Numéro d'établissement": uai,
      },
    });

    const { capacite } = await getIndicateursAffelnet({
      isSpecialite,
      mefstat11FirstYear,
      libelleDebut,
      uai,
    });

    const indicateurEntree = toIndicateurEntree({
      mefstat11FirstYear,
      formationEtablissementId,
      uai,
      cab_nbre_division_effectifs_par_etab_mefst11,
      capacite,
    });
    if (!indicateurEntree) return;
    await createIndicateurEntree([indicateurEntree]);
  };
};

const toIndicateurEntree = ({
  mefstat11FirstYear,
  formationEtablissementId,
  uai,
  cab_nbre_division_effectifs_par_etab_mefst11,
  capacite,
}: {
  mefstat11FirstYear: string;
  formationEtablissementId: string;
  uai: string;
  cab_nbre_division_effectifs_par_etab_mefst11: Cab_bre_division_effectifs_par_etab_mefst11;
  capacite?: number;
}) => {
  const type = "effectifEntree";

  const indicateurEntree: IndicateurEntree = {
    formationEtablissementId,
    millesimeEntree: "2022",
    effectifEntree:
      parseInt(
        cab_nbre_division_effectifs_par_etab_mefst11?.["Nombre d'élèves"]
      ) || undefined,
    capacite,
  };

  const status =
    indicateurEntree.effectifEntree !== undefined ? "ok" : "missing";
  logger.log({ type, log: { uai, mefstat11FirstYear, status } });
  if (!indicateurEntree) return;
  return indicateurEntree;
};
