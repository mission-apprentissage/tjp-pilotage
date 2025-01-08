import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("diplomeProfessionnel").dropConstraint("diplomeProfessionnel_pkey").ifExists().execute();

  await db.schema.alterTable("diplomeProfessionnel").addColumn("voie", "varchar").execute();

  await db.schema
    .alterTable("diplomeProfessionnel")
    .addUniqueConstraint("diplomeProfessionnel_unique_constraint", ["cfd", "voie"])
    .execute();

  await db.schema
    .alterTable("formationEtablissement")
    .alterColumn("dispositifId", (col) => col.dropNotNull())
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .alterColumn("dispositifId", (col) => col.dropNotNull())
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .dropConstraint("indicateurRegionSortie_cfd_fkey")
    .ifExists()
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .dropConstraint("indicateurRegionSortie_cfdContinuum_fkey")
    .ifExists()
    .execute();

  await db.schema
    .alterTable("indicateurSortie")
    .dropConstraint("indicateurSortie_cfdContinuum_fkey")
    .ifExists()
    .execute();

  await db.schema.dropView("formationNonMaterializedView").ifExists().execute();

  await db.schema.dropView("formationView").materialized().ifExists().execute();

  await db.schema
    .createView("formationNonMaterializedView")
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
        df."typeFamille",
        dp."voie"
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
      left join "diplomeProfessionnel" dp on dp."cfd" = df."cfd"
      order by df."cfd";
      `,
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
        df."typeFamille",
        formations."voie"
      from "dataFormation" df
      inner join
      (
        select dp."cfd", dp."voie"
        from "diplomeProfessionnel" dp
        union
        select distinct "ancienCFD", 'scolaire' as "voie"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille", 'scolaire' as "voie"
        from "familleMetier" fm
      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";

      create unique index on "formationView" ("id");
      `,
    )
    .materialized()
    .execute();

  await db.schema
    .createView("formationScolaireView")
    .as(
      sql`
        select
          uuid_generate_v4() as id,
          fv."cfd",
          fv."rncp",
          fv."libelleFormation" as "libelleFormation",
          fv."codeNiveauDiplome",
          fv."dateOuverture",
          fv."dateFermeture",
          fv."cpc",
          fv."cpcSecteur",
          fv."cpcSousSecteur",
          fv."libelleFiliere",
          fv."typeFamille",
          fv."voie"
        from "formationView" fv
        where "voie" is null
        or "voie" = 'scolaire';

        create unique index on "formationScolaireView" ("id");`,
    )
    .materialized()
    .execute();

  await db.schema
    .createView("formationApprentissageView")
    .as(
      sql`
          select
            uuid_generate_v4() as id,
            fv."cfd",
            fv."rncp",
            fv."libelleFormation" as "libelleFormation",
            fv."codeNiveauDiplome",
            fv."dateOuverture",
            fv."dateFermeture",
            fv."cpc",
            fv."cpcSecteur",
            fv."cpcSousSecteur",
            fv."libelleFiliere",
            fv."typeFamille",
            fv."voie"
          from "formationView" fv
          where "voie" is not null
          and "voie" = 'apprentissage';

          create unique index on "formationApprentissageView" ("id");`,
    )
    .materialized()
    .execute();

  await db.schema.alterTable("formationEtablissement").dropConstraint("formationetablissement_pk").execute();

  await db.schema
    .alterTable("formationEtablissement")
    .addUniqueConstraint("formationetablissement_pk", ["cfd", "UAI", "dispositifId", "voie"], (builder) =>
      builder.nullsNotDistinct(),
    )
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .dropConstraint("indicateurRegionSortie_unique_constraint")
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .addUniqueConstraint(
      "indicateurRegionSortie_unique_constraint",
      ["cfd", "codeRegion", "dispositifId", "millesimeSortie", "voie"],
      (builder) => builder.nullsNotDistinct(),
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("formationApprentissageView").materialized().ifExists().execute();

  await db.schema.dropView("formationScolaireView").materialized().ifExists().execute();

  await db.schema.dropView("formationNonMaterializedView").ifExists().execute();

  await db.schema.dropView("formationView").materialized().ifExists().execute();

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
    `,
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
    `,
    )
    .materialized()
    .execute();

  await db.executeQuery(sql`TRUNCATE TABLE "indicateurSortie" CASCADE;`.compile(db));

  await db.schema
    .alterTable("indicateurSortie")
    .addForeignKeyConstraint("indicateurSortie_cfdContinuum_fkey", ["cfdContinuum"], "formation", [
      "codeFormationDiplome",
    ])
    .execute();

  await db.executeQuery(sql`TRUNCATE TABLE "indicateurRegionSortie" CASCADE;`.compile(db));

  await db.schema
    .alterTable("indicateurRegionSortie")
    .addForeignKeyConstraint("indicateurRegionSortie_cfdContinuum_fkey", ["cfdContinuum"], "formation", [
      "codeFormationDiplome",
    ])
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .addForeignKeyConstraint("indicateurRegionSortie_cfd_fkey", ["cfd"], "formation", ["codeFormationDiplome"])
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .alterColumn("dispositifId", (col) => col.setNotNull())
    .execute();

  await db.executeQuery(sql`TRUNCATE TABLE "formationEtablissement" CASCADE;`.compile(db));

  await db.schema
    .alterTable("formationEtablissement")
    .alterColumn("dispositifId", (col) => col.setNotNull())
    .execute();

  await db.schema
    .alterTable("diplomeProfessionnel")
    .dropConstraint("diplomeProfessionnel_unique_constraint")
    .ifExists()
    .execute();

  await db.schema.alterTable("diplomeProfessionnel").dropColumn("voie").execute();

  await db.executeQuery(sql`TRUNCATE TABLE "diplomeProfessionnel";`.compile(db));

  await db.schema
    .alterTable("diplomeProfessionnel")
    .addPrimaryKeyConstraint("diplomeProfessionnel_pkey", ["cfd"])
    .execute();
};
