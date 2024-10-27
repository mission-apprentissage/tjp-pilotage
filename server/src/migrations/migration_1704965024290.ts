import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("familleMetier").dropConstraint("familleMetier_pkey").ifExists().execute();

  await db.schema
    .alterTable("familleMetier")
    .dropConstraint("familleMetier_mefStat11Specialite_key")
    .ifExists()
    .execute();

  await db.schema
    .alterTable("familleMetier")
    .dropColumn("mefStat11Specialite")
    .dropColumn("mefStat11Famille")
    .execute();

  await db.schema
    .alterTable("familleMetier")
    .addUniqueConstraint("familleMetier_cfdSpecialite_key", ["cfdSpecialite"])
    .execute();

  /* Les vues doivent être dropped avant de pouvoir modifier les types */
  await db.schema.dropView("formationView").materialized().execute();

  await db.schema.dropView("formationNonMaterializedView").execute();

  await db.executeQuery(
    sql`
        ALTER TYPE "typeFamille" RENAME TO "typeFamille_old";

        CREATE TYPE "typeFamille" AS ENUM ('2nde_commune', 'specialite', '1ere_commune', 'option');

        ALTER TABLE "dataFormation" ALTER COLUMN "typeFamille" TYPE "typeFamille" USING "typeFamille"::text::"typeFamille";

        DROP TYPE "typeFamille_old";
      `.compile(db)
  );

  await db.schema
    .createView("formationNonMaterializedView")
    .as(
      sql`
      select
        uuid_generate_v4() as id,
        df."cfd",
        df."rncp",
        df."libelleFormation" as "libelleFormation",
        df."codeNiveauDiplome",
        df."dateOuverture",
        df."dateFermeture",
        df."cpc",
        df."cpcSecteur",
        df."cpcSousSecteur",
        df."libelleFiliere",
        df."typeFamille"
      from "dataFormation" df
      inner join
      (
        select dp."cfd"
        from "diplomeProfessionnel" dp
        union
        select distinct fh."ancienCFD"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille"
        from "familleMetier" fm

      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";
      `
    )
    .execute();

  await db.schema
    .createView("formationView")
    .as(
      sql`
      select uuid_generate_v4() as id,
        df."cfd",
        df."rncp",
        df."libelleFormation" as "libelleFormation",
        df."codeNiveauDiplome",
        df."dateOuverture",
        df."dateFermeture",
        df."cpc",
        df."cpcSecteur",
        df."cpcSousSecteur",
        df."libelleFiliere",
        df."typeFamille"
      from "dataFormation" df
      inner join
      (
        select dp."cfd"
        from "diplomeProfessionnel" dp
        union
        select distinct "ancienCFD"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille"
        from "familleMetier" fm
      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";

      create unique index on "formationView" ("id");
      `
    )
    .materialized()
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("formationView").materialized().execute();

  await db.schema.dropView("formationNonMaterializedView").execute();

  await db.executeQuery(sql`TRUNCATE TABLE "dataFormation" CASCADE;`.compile(db));

  await db.executeQuery(
    sql`
      ALTER TYPE "typeFamille" RENAME TO "typeFamille_old";

      CREATE TYPE "typeFamille" AS ENUM ('2nde_commune', 'specialite');

      ALTER TABLE "dataFormation" ALTER COLUMN "typeFamille" TYPE "typeFamille" USING "typeFamille"::text::"typeFamille";

      DROP TYPE "typeFamille_old";
    `.compile(db)
  );

  await db.schema
    .createView("formationNonMaterializedView")
    .as(
      sql`
      select
        uuid_generate_v4() as id,
        df."cfd",
        df."rncp",
        df."libelleFormation" as "libelleFormation",
        df."codeNiveauDiplome",
        df."dateOuverture",
        df."dateFermeture",
        df."cpc",
        df."cpcSecteur",
        df."cpcSousSecteur",
        df."libelleFiliere",
        df."typeFamille"
      from "dataFormation" df
      inner join
      (
        select dp."cfd"
        from "diplomeProfessionnel" dp
        union
        select distinct fh."ancienCFD"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille"
        from "familleMetier" fm

      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";
      `
    )
    .execute();

  await db.schema
    .createView("formationView")
    .as(
      sql`
      select uuid_generate_v4() as id,
        df."cfd",
        df."rncp",
        df."libelleFormation" as "libelleFormation",
        df."codeNiveauDiplome",
        df."dateOuverture",
        df."dateFermeture",
        df."cpc",
        df."cpcSecteur",
        df."cpcSousSecteur",
        df."libelleFiliere",
        df."typeFamille"
      from "dataFormation" df
      inner join
      (
        select dp."cfd"
        from "diplomeProfessionnel" dp
        union
        select distinct "ancienCFD"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille"
        from "familleMetier" fm
      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";

      create unique index on "formationView" ("id");
      `
    )
    .materialized()
    .execute();

  await db.schema.alterTable("familleMetier").dropConstraint("familleMetier_cfdSpecialite_key").execute();

  await db.schema
    .alterTable("familleMetier")
    .addColumn("mefStat11Specialite", "varchar", (c) => c.unique())
    .addColumn("mefStat11Famille", "varchar")
    .execute();

  /* TODO: remettre les contraintes de non nullité et de clé primaire (impossible de le faire sans truncate la table préalablement)

  await db.schema
    .alterTable("familleMetier")
    .addPrimaryKeyConstraint("familleMetier_pkey", ["mefStat11Specialite"])
    .execute()

    */
};
