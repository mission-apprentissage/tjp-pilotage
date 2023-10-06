import { inject } from "injecti";

import {
  AnneeDispositif,
  AnneeEnseignement,
} from "../../../getCfdRentrees/getCfdRentrees.usecase";
import { getIndicateursAffelnet } from "../getIndicateurAffelnet/getIndicateurAffelnet.step";
import { createIndicateurEntree } from "./createIndicateurEntree.dep";
import { findFamilleMetier } from "./findFamilleMetier";

export const [importIndicateurEntree, importIndicateurEntreeFactory] = inject(
  {
    createIndicateurEntree,
    getIndicateursAffelnet,
    findFamilleMetier,
  },
  (deps) => {
    return async ({
      formationEtablissementId,
      anneesEnseignement,
      anneesDispositif,
      cfd,
      anneeDebutConstate,
      rentreeScolaire,
      uai,
    }: {
      formationEtablissementId: string;
      anneesEnseignement: AnneeEnseignement[];
      anneesDispositif: AnneeDispositif[];
      anneeDebutConstate: number;
      cfd: string;
      rentreeScolaire: string;
      uai: string;
    }) => {
      const isSpecialite = await deps.findFamilleMetier({
        cfdSpecialite: cfd,
      });

      const anneeDebut = isSpecialite ? 1 : anneeDebutConstate;

      const { capacites, premiersVoeux } = await deps.getIndicateursAffelnet({
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
