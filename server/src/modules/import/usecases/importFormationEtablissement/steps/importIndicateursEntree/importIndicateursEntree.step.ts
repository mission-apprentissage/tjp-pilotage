import { inject } from "injecti";

import {
  AnneeDispositif,
  AnneeEnseignement,
} from "../../../getCfdRentrees/getCfdRentrees.usecase";
import { getIndicateursAffelnet } from "../getIndicateurAffelnet/getIndicateurAffelnet.step";
import { getIndicateursParcoursSup } from "../getIndicateursParcoursSup/getIndicateursParcoursSup.step";
import { createIndicateurEntree } from "./createIndicateurEntree.dep";
import { findAnneeCommune, findSpecialite } from "./findFamilleMetier";
import { findHistorique } from "./findHistorique";

const isBTS = (cfd: string) => cfd.substring(0, 3) === "320";

export const [importIndicateurEntree, importIndicateurEntreeFactory] = inject(
  {
    createIndicateurEntree,
    getIndicateursAffelnet,
    getIndicateursParcoursSup,
    findAnneeCommune,
    findSpecialite,
    findHistorique,
  },
  (deps) => {
    return async ({
      formationEtablissementId,
      anneesEnseignement,
      anneesDispositif,
      cfd,
      rentreeScolaire,
      uai,
    }: {
      formationEtablissementId: string;
      anneesEnseignement: AnneeEnseignement[];
      anneesDispositif: Record<string, AnneeDispositif>;
      cfd: string;
      rentreeScolaire: string;
      uai: string;
    }) => {
      const isSpecialite = await deps.findSpecialite({
        cfd,
      });
      const isAnneeCommune = await deps.findAnneeCommune({
        cfdFamille: cfd,
      });

      const anneeDebut = isSpecialite && !isAnneeCommune ? 1 : 0;

      const { capacites, premiersVoeux } = isBTS(cfd)
        ? await deps.getIndicateursParcoursSup({
            anneesDispositif,
            uai,
            anneeDebut,
            rentreeScolaire,
          })
        : await deps.getIndicateursAffelnet({
            anneesDispositif,
            uai,
            anneeDebut,
            rentreeScolaire,
          });

      const indicateurEntree = toIndicateurEntree({
        anneesEnseignement,
        formationEtablissementId,
        capacites,
        anneeDebut,
        premiersVoeux,
        rentreeScolaire,
      });
      if (!indicateurEntree) return;
      await deps.createIndicateurEntree(indicateurEntree);
    };
  }
);

const toIndicateurEntree = ({
  anneesEnseignement,
  formationEtablissementId,
  capacites,
  anneeDebut,
  premiersVoeux,
  rentreeScolaire,
}: {
  anneesEnseignement: AnneeEnseignement[];
  formationEtablissementId: string;
  capacites?: (number | null)[];
  anneeDebut: number;
  premiersVoeux: (number | null)[];
  rentreeScolaire: string;
}) => {
  const indicateurEntree = {
    formationEtablissementId,
    rentreeScolaire,
    anneeDebut: anneeDebut,
    effectifs: anneesEnseignement.map((annee) => annee.effectif ?? null),
    capacites: anneesEnseignement.map((_, i) => capacites?.[i] ?? null),
    premiersVoeux,
  };

  if (!indicateurEntree) return;
  return indicateurEntree;
};
