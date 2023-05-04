import { IndicateurEntree } from "../../../entities/IndicateurEntree";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "../dependencies.di";
import { getIndicateursAffelnetFactory } from "./getIndicateurAffelnet.step";

export const importIndicateurEntreeFactory = ({
  createIndicateurEntree = dependencies.createIndicateurEntree,
  getIndicateursAffelnet = getIndicateursAffelnetFactory({}),
  findFamilleMetier = dependencies.findFamilleMetier,
} = {}) => {
  return async ({
    formationEtablissementId,
    dispositifRentrees,
  }: {
    formationEtablissementId: string;
    dispositifRentrees: CfdRentrees;
  }) => {
    const isSpecialite = !!(await findFamilleMetier({
      cfdSpecialite: dispositifRentrees.cfd,
    }));

    const anneeDebut = isSpecialite ? 1 : dispositifRentrees.anneeDebutConstate;

    const { capacites, premiersVoeux } = await getIndicateursAffelnet({
      dispositifRentrees,
      anneeDebut,
    });

    const indicateurEntree = toIndicateurEntree({
      dispositifRentrees,
      formationEtablissementId,
      capacites,
      anneeDebut,
      premiersVoeux,
    });
    if (!indicateurEntree) return;
    await createIndicateurEntree([indicateurEntree]);
  };
};

const toIndicateurEntree = ({
  dispositifRentrees,
  formationEtablissementId,
  capacites,
  anneeDebut,
  premiersVoeux,
}: {
  dispositifRentrees: CfdRentrees;
  formationEtablissementId: string;
  capacites?: (number | null)[];
  anneeDebut: number;
  premiersVoeux: (number | null)[];
}) => {
  const indicateurEntree: IndicateurEntree = {
    formationEtablissementId,
    rentreeScolaire: "2022",
    anneeDebut: anneeDebut,
    effectifs: dispositifRentrees.annees.map((annee) => annee.effectif ?? null),
    capacites: dispositifRentrees.annees.map((_, i) => capacites?.[i] ?? null),
    premiersVoeux,
  };

  if (!indicateurEntree) return;
  return indicateurEntree;
};
