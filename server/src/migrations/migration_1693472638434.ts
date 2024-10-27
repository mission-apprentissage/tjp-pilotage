/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema.createType("demandeStatus").asEnum(["draft", "submitted"]).execute();
  await db.schema
    .createTable("demande")
    .addColumn("id", "varchar", (c) => c.unique().notNull())
    .addColumn("cfd", "varchar(8)")
    .addColumn("libelleDiplome", "varchar")
    .addColumn("dispositifId", "varchar(3)")
    .addColumn("uai", "varchar(8)")
    .addColumn("rentreeScolaire", "integer")
    .addColumn("typeDemande", "varchar")
    .addColumn("motif", sql`varchar[]`)
    .addColumn("autreMotif", "varchar")
    .addColumn("coloration", "boolean")
    .addColumn("libelleColoration", "varchar")
    .addColumn("amiCma", "boolean")
    .addColumn("poursuitePedagogique", "boolean")
    .addColumn("commentaire", "varchar")
    .addColumn("status", sql`"demandeStatus"`, (c) => c.notNull())
    .addColumn("codeRegion", "varchar(2)", (c) => c.references("region.codeRegion"))
    .addColumn("codeAcademie", "varchar(2)", (c) => c.references("academie.codeAcademie"))
    .addColumn("createurId", "uuid", (c) => c.notNull())
    .addColumn("createdAt", "timestamptz", (c) => c.notNull().defaultTo(sql`NOW()`))
    .execute();
};

export const down = async () => {};
