import { inject } from "injecti";

import { IndicateurEntree } from "../../../entities/IndicateurEntree";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "../dependencies.di";
import { getIndicateursAffelnet as getIndicateursAffelnetDep } from "./getIndicateurAffelnet.step";

export const [importIndicateurEntree, importIndicateurEntreeFactory] = inject(
  {
    createIndicateurEntree: dependencies.createIndicateurEntree,
    getIndicateursAffelnet: getIndicateursAffelnetDep,
    findFamilleMetier: dependencies.findFamilleMetier,
  },
  (deps) => {
    return async ({
      formationEtablissementId,
      dispositifRentrees,
      rentreeScolaire,
    }: {
      formationEtablissementId: string;
      dispositifRentrees: CfdRentrees;
      rentreeScolaire: string;
    }) => {
      const isSpecialite = !!(await deps.findFamilleMetier({
        cfdSpecialite: dispositifRentrees.cfd,
      }));

      const anneeDebut = isSpecialite
        ? 1
        : dispositifRentrees.anneeDebutConstate;

      const { capacites, premiersVoeux } = await deps.getIndicateursAffelnet({
        dispositifRentrees,
        anneeDebut,
        rentreeScolaire,
      });

      const indicateurEntree = toIndicateurEntree({
        dispositifRentrees,
        formationEtablissementId,
        capacites,
        anneeDebut,
        premiersVoeux,
        rentreeScolaire,
      });
      if (!indicateurEntree) return;
      await deps.createIndicateurEntree([indicateurEntree]);
    };
  }
);

const toIndicateurEntree = ({
  dispositifRentrees,
  formationEtablissementId,
  capacites,
  anneeDebut,
  premiersVoeux,
  rentreeScolaire,
}: {
  dispositifRentrees: CfdRentrees;
  formationEtablissementId: string;
  capacites?: (number | null)[];
  anneeDebut: number;
  premiersVoeux: (number | null)[];
  rentreeScolaire: string;
}) => {
  const indicateurEntree: IndicateurEntree = {
    formationEtablissementId,
    rentreeScolaire,
    anneeDebut: anneeDebut,
    effectifs: dispositifRentrees.annees.map((annee) => annee.effectif ?? null),
    capacites: dispositifRentrees.annees.map((_, i) => capacites?.[i] ?? null),
    premiersVoeux,
  };

  if (!indicateurEntree) return;
  return indicateurEntree;
};
