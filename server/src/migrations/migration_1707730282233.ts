import type { Kysely } from "kysely";

import type { DB } from "@/db/schema";

export const up = async (db: Kysely<DB>) => {
  // Suppression des données de tous les anciens constats de rentrée, pour cause
  // de renommage
  await db.deleteFrom("rawData").where("type", "like", "Cab-nbre_division_effectifs_par_etab_mefst11%").execute();
  // Suppression des données des anciens fichiers d'attractivité BTS, pour cause
  // de renommage
  await db.deleteFrom("rawData").where("type", "like", "attractivite_capacite_BTS%").execute();
  // Suppression du fichier 2021 de l'attractivité des BTS
  await db
    .deleteFrom("indicateurEntree")
    .where((eb) =>
      eb.and([
        eb.or([eb("rentreeScolaire", "=", "2020"), eb("rentreeScolaire", "=", "2021")]),
        eb(
          "formationEtablissementId",
          "in",
          db.selectFrom("formationEtablissement").select("id").where("formationEtablissement.cfd", "like", "320%")
        ),
      ])
    )
    .execute();
};

export const down = async () => {
  // Pour revert il suffit de jouer importFiles, importTables et importFormations
};
