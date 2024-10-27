import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("formationScolaireView").materialized().ifExists().execute();

  await db.schema.dropView("formationApprentissageView").materialized().ifExists().execute();

  await db.schema.dropView("formationView").materialized().ifExists().execute();
  await db.schema.dropView("formationNonMaterializedView").ifExists().execute();

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
        formations."voie"
      from "dataFormation" df
      inner join
      (
        select dp."cfd", dp."voie"
        from "diplomeProfessionnel" dp
        union
        select distinct "ancienCFD", fh."voie"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille", 'scolaire' as "voie"
        from "familleMetier" fm
      ) as formations
      on df."cfd" = formations.cfd
      left join "diplomeProfessionnel" dp on dp."cfd" = df."cfd"
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
        df."typeFamille",
        formations."voie"
      from "dataFormation" df
      inner join
      (
        select dp."cfd", dp."voie"
        from "diplomeProfessionnel" dp
        union
        select distinct "ancienCFD", fh."voie"
        from "formationHistorique" fh
        union
        select distinct fm."cfdFamille", 'scolaire' as "voie"
        from "familleMetier" fm
      ) as formations
      on df."cfd" = formations.cfd
      order by df."cfd";

      create unique index on "formationView" ("id");
      `
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

          create unique index on "formationScolaireView" ("id");`
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

            create unique index on "formationApprentissageView" ("id");`
    )
    .materialized()
    .execute();
};

export const down = async (_db: Kysely<unknown>) => {
  // No down migration
};
