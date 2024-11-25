import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { TauxIJParAnneeSchema } from "@/modules/data/usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.schema";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";

type TauxIJParAnnee = z.infer<typeof TauxIJParAnneeSchema>;

const getRentreesScolaires = async () => {
  return await getKbdClient()
    .selectFrom("indicateurEntree")
    .select("rentreeScolaire")
    .distinct()
    .orderBy("rentreeScolaire", "desc")
    .execute()
    .then((rentreesScolaireArray) => rentreesScolaireArray.map((rentreeScolaire) => rentreeScolaire.rentreeScolaire));
};

const getMillesimesSortie = async () => {
  return await getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .select("millesimeSortie")
    .distinct()
    .orderBy("millesimeSortie", "desc")
    .execute()
    .then((millesimesSortieArray) => millesimesSortieArray.map((millesimeSortie) => millesimeSortie.millesimeSortie));
};

const selectStatsSortie = ({
  codeRegion,
  codeNiveauDiplome,
  annee = 0,
  rentreeScolaire,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
  annee: number;
  rentreeScolaire: string;
}) =>
  getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .innerJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .$call((q) =>
      q.where(
        "indicateurRegionSortie.millesimeSortie",
        "=",
        getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: annee })
      )
    )
    .where(isScolaireIndicateurRegionSortie)
    .where(notAnneeCommuneIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirstOrThrow();

export const getTauxIJ = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion: string;
  codeNiveauDiplome?: string[];
}) => {
  const rentreesScolaires = await getRentreesScolaires();
  const rentreeScolaire = rentreesScolaires[0];
  const millesimesSortie = await getMillesimesSortie();

  const getStatsAnnee = async (millesimeSortie: string) => {
    // millesimeSortie est au format 2000_2001
    const finDanneeScolaireMillesime = parseInt(millesimeSortie.split("_")[1]);
    const rentree = parseInt(rentreeScolaire);
    const offset = finDanneeScolaireMillesime - rentree;

    const tauxIJRegion = await selectStatsSortie({
      codeNiveauDiplome,
      codeRegion,
      rentreeScolaire,
      annee: offset + 1,
    });

    const tauxIJNationale = await selectStatsSortie({
      codeNiveauDiplome,
      rentreeScolaire,
      annee: offset + 1,
    });

    return {
      annee: finDanneeScolaireMillesime,
      libelleAnnee: millesimeSortie.split("_").join("+"),
      millesime: millesimeSortie.split("_"),
      tauxInsertion: {
        region: tauxIJRegion.tauxInsertion,
        nationale: tauxIJNationale.tauxInsertion,
      },
      tauxPoursuite: {
        region: tauxIJRegion.tauxPoursuite,
        nationale: tauxIJNationale.tauxPoursuite,
      },
    };
  };

  const annees = await Promise.all(millesimesSortie.map(async (millesimeSortie) => getStatsAnnee(millesimeSortie)));

  const [tauxInsertion, tauxPoursuite] = annees.reduce(
    ([tauxInsertion, tauxPoursuite], current) => {
      tauxInsertion[current.annee] = {
        annee: current.annee.toString(),
        libelleAnnee: current.libelleAnnee,
        filtered: (current.tauxInsertion.region ?? 0) * 100,
        nationale: (current.tauxInsertion.nationale ?? 0) * 100,
      };
      tauxPoursuite[current.annee] = {
        annee: current.annee.toString(),
        libelleAnnee: current.libelleAnnee,
        filtered: (current.tauxPoursuite.region ?? 0) * 100,
        nationale: (current.tauxPoursuite.nationale ?? 0) * 100,
      };

      return [tauxInsertion, tauxPoursuite];
    },
    [{} as TauxIJParAnnee, {} as TauxIJParAnnee]
  );

  return {
    tauxInsertion,
    tauxPoursuite,
  };
};
