import _ from "lodash";
import { conditions, IsolationLevel } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { AncienneFormation } from "../../entities/Formation";

export const createFormationsHistoriques = async (
  anciennesFormations: Omit<AncienneFormation, "id">[]
) => {
  const formationsHistoriques = anciennesFormations.map(
    (ancienneFormation) => ({
      codeFormationDiplome: ancienneFormation.nouveauCFD,
      ancienCFD: ancienneFormation.codeFormationDiplome,
    })
  );

  await db.transaction(pool, IsolationLevel.Serializable, async (tr) => {
    await db
      .upsert(
        "formation",
        anciennesFormations.map((item) => _.omit(item, "nouveauCFD")),
        "codeFormationDiplome"
      )
      .run(tr);

    await db
      .upsert("formationHistorique", formationsHistoriques, [
        "ancienCFD",
        "codeFormationDiplome",
      ])
      .run(tr);
  });
};

export const getFormations = async () => {
  return await db
    .select("formation", { dateFermeture: conditions.isNotNull })
    .run(pool);
};

export const createFormationsHistoriquesDeps = {
  createFormationsHistoriques,
  getFormations,
};
