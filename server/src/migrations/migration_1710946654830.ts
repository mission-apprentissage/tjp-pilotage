import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createView("latestDemandeView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            .select([
              sql<number>`max("demande"."dateModification")`.as(
                "dateDerniereModification"
              ),
              "numero",
            ])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef(
              "latestDemandes.dateDerniereModification",
              "=",
              "demande.dateModification"
            )
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted")
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").execute();
};
