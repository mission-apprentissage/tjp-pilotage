import { IndicateurEntree } from "../../../entities/IndicateurEntree";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "../dependencies.di";
import { logger } from "../importLogger";
import { getIndicateursAffelnetFactory } from "./getIndicateurAffelnet.step";

export const importIndicateurEntreeFactory = ({
  createIndicateurEntree = dependencies.createIndicateurEntree,
  getIndicateursAffelnet = getIndicateursAffelnetFactory(),
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
    const { capacite } = await getIndicateursAffelnet({
      isSpecialite,
      dispositifRentrees,
    });

    const indicateurEntree = toIndicateurEntree({
      dispositifRentrees,
      formationEtablissementId,
      capacite,
    });
    if (!indicateurEntree) return;
    await createIndicateurEntree([indicateurEntree]);
  };
};

const toIndicateurEntree = ({
  dispositifRentrees,
  formationEtablissementId,
  capacite,
}: {
  dispositifRentrees: CfdRentrees;
  formationEtablissementId: string;
  capacite?: number;
}) => {
  const type = "effectifEntree";

  const indicateurEntree: IndicateurEntree = {
    formationEtablissementId,
    millesimeEntree: "2022",
    // effectifs: mefs.annees.map((annee) => annee.effectif),
    effectifEntree: dispositifRentrees.annees.find((annee) => annee.constatee)
      ?.effectif,
    capacite,
  };

  const status =
    indicateurEntree.effectifEntree !== undefined ? "ok" : "missing";
  logger.log({ type, log: { uai: dispositifRentrees.uai, status } });
  if (!indicateurEntree) return;
  return indicateurEntree;
};
