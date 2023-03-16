import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { NMefLine } from "../../files/NMef";
import { dependencies } from "./dependencies.di";

const toCfdMefs = ({
  nMefs,
  isSpecialite,
}: {
  nMefs: NMefLine[];
  isSpecialite: boolean;
}) => {
  return nMefs
    .filter(
      (item) => parseInt(item.ANNEE_DISPOSITIF) === (isSpecialite ? 2 : 1)
    )
    .map((nMefDebut) => {
      const nMefFin = nMefs.find(
        (item) =>
          item.DUREE_DISPOSITIF === nMefDebut.DUREE_DISPOSITIF &&
          item.DUREE_DISPOSITIF === item.ANNEE_DISPOSITIF
      );
      if (!nMefFin) return;

      return { nMefDebut, nMefFin };
    })
    .filter((item): item is Exclude<typeof item, undefined> => !!item);
};

const toUaiFormations = ({
  constatRentrees,
  cfd,
  nMefDebut,
  nMefFin,
}: {
  constatRentrees: Cab_bre_division_effectifs_par_etab_mefst11[];
  cfd: string;
  nMefDebut: NMefLine;
  nMefFin: NMefLine;
}) => {
  return constatRentrees.map(
    (constatRentree) =>
      ({
        cfd,
        mefstat11LastYear: nMefFin.MEF_STAT_11,
        mefstat11FirstYear: nMefDebut.MEF_STAT_11,
        dispositifId: nMefDebut.DISPOSITIF_FORMATION,
        voie: "scolaire",
        uai: constatRentree["Numéro d'établissement"],
      } as const)
  );
};

export const getUaiFormationsFactory =
  ({
    findNMefs = dependencies.findNMefs,
    findContratRentrees = dependencies.findContratRentrees,
    findFamilleMetier = dependencies.findFamilleMetier,
  }) =>
  async ({ cfd }: { cfd: string }) => {
    let cfdUaiFormations: ReturnType<typeof toUaiFormations> = [];

    const isSpecialite = !!(await findFamilleMetier({ cfdSpecialite: cfd }));
    const nMefs = await findNMefs({ cfd });

    const cfdMefs = toCfdMefs({ nMefs, isSpecialite });

    for (const { nMefDebut, nMefFin } of cfdMefs) {
      const constatRentrees = await findContratRentrees({
        mefStat11: nMefDebut.MEF_STAT_11,
      });

      const uaiFormations = toUaiFormations({
        cfd,
        constatRentrees,
        nMefDebut,
        nMefFin,
      });

      cfdUaiFormations = [...cfdUaiFormations, ...uaiFormations];
    }
    return cfdUaiFormations;
  };
