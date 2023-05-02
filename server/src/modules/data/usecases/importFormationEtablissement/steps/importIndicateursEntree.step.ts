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
    const { capacite, capacites } = await getIndicateursAffelnet({
      isSpecialite,
      dispositifRentrees,
    });

    const indicateurEntree = toIndicateurEntree({
      dispositifRentrees,
      formationEtablissementId,
      capacite,
      capacites,
      isSpecialite,
    });
    if (!indicateurEntree) return;
    await createIndicateurEntree([indicateurEntree]);
  };
};

const toIndicateurEntree = ({
  dispositifRentrees,
  formationEtablissementId,
  capacite,
  capacites,
  isSpecialite,
}: {
  dispositifRentrees: CfdRentrees;
  formationEtablissementId: string;
  capacite?: number;
  capacites?: (number | null)[];
  isSpecialite: boolean;
}) => {
  const type = "effectifEntree";

  const indicateurEntree: IndicateurEntree = {
    formationEtablissementId,
    millesimeEntree: "2022",
    anneeDebut: isSpecialite ? 1 : dispositifRentrees.anneeDebut,
    effectifs: dispositifRentrees.annees.map((annee) => annee.effectif ?? null),
    capacites: dispositifRentrees.annees.map((_, i) => capacites?.[i] ?? null),
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
