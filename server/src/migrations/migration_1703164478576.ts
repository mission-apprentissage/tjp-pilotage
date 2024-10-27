import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("formationView").materialized().execute();

  await db.schema.dropView("formationNonMaterializedView").execute();

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

  await db.schema.alterTable("formationEtablissement").dropConstraint("fk_formation").ifExists().execute();
};

export const down = async (db: Kysely<unknown>) => {
  // TODO: handle adding back the constraint
  // await db.schema
  //   .alterTable("formationEtablissement")
  //   .addForeignKeyConstraint("fk_formation", ["cfd"], "formation", [
  //     "codeFormationDiplome",
  //   ])
  //   .execute();

  await db.schema.dropView("formationView").materialized().execute();

  await db.schema.dropView("formationNonMaterializedView").execute();

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
        select distinct "ancienCFD"
        from "formationHistorique" fh
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
      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";

      create unique index on "formationView" ("id");
      `
    )
    .materialized()
    .execute();
};
