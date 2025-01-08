/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema.dropView("formationScolaireView").materialized().ifExists().execute();

  await db.schema.dropView("formationApprentissageView").materialized().ifExists().execute();

  await db.schema.dropView("formationView").materialized().ifExists().execute();
  await db.schema.dropView("formationNonMaterializedView").ifExists().execute();

  await db.schema.alterTable("dataFormation").dropColumn("libelleFiliere").execute();

  await db.schema
    .createView("formationNonMaterializedView")
    .as(
      db
        .selectFrom("dataFormation")
        .innerJoin(
          (join) =>
            join
              .selectFrom("diplomeProfessionnel")
              .select(["cfd", "voie"])
              .union(
                db
                  .selectFrom("formationHistorique")
                  .distinct()
                  .select(["formationHistorique.ancienCFD as cfd", "formationHistorique.voie"]),
              )
              .union(
                db
                  .selectFrom("familleMetier")
                  .distinct()
                  .select((sb) => ["cfdFamille", sb.val("scolaire").as("voie")])
                  .$castTo<{ cfd: string; voie: string }>(),
              )
              .as("formations"),
          (join) => join.onRef("formations.cfd", "=", "dataFormation.cfd"),
        )
        .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "dataFormation.cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "typeFamille",
          "formations.voie",
          "nsf.libelleNsf",
          "nsf.codeNsf",
        ])
        .orderBy("cfd"),
    )
    .execute();

  await db.schema
    .createView("formationView")
    .as(
      db
        .selectFrom("dataFormation")
        .innerJoin(
          (join) =>
            join
              .selectFrom("diplomeProfessionnel")
              .select(["cfd", "voie"])
              .union(
                db
                  .selectFrom("formationHistorique")
                  .distinct()
                  .select(["formationHistorique.ancienCFD as cfd", "formationHistorique.voie"]),
              )
              .union(
                db
                  .selectFrom("familleMetier")
                  .distinct()
                  .select((sb) => ["cfdFamille", sb.val("scolaire").as("voie")])
                  .$castTo<{ cfd: string; voie: string }>(),
              )
              .as("formations"),
          (join) => join.onRef("formations.cfd", "=", "dataFormation.cfd"),
        )
        .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "dataFormation.cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "typeFamille",
          "formations.voie",
          "nsf.codeNsf",
          "nsf.libelleNsf",
        ])
        .orderBy("cfd"),
    )
    .materialized()
    .execute();

  await db.schema.createIndex("formationView_index").unique().on("formationView").column("id").ifNotExists().execute();

  await db.schema
    .createView("formationScolaireView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom("formationView")
        // @ts-ignore
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "codeNsf",
          "libelleNsf",
          "typeFamille",
          "voie",
        ])
        .where((eb) => eb.or([eb("voie", "is", eb.val(null)), eb("voie", "=", eb.val("scolaire"))])),
    )
    .materialized()
    .execute();

  await db.schema
    .createIndex("formationScolaireView_index")
    .unique()
    .on("formationScolaireView")
    .column("id")
    .execute();

  await db.schema
    .createView("formationApprentissageView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom("formationView")
        // @ts-ignore
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "codeNsf",
          "libelleNsf",
          "typeFamille",
          "voie",
        ])
        .where((eb) => eb.and([eb("voie", "is not", eb.val(null)), eb("voie", "=", eb.val("apprentissage"))])),
    )
    .materialized()
    .execute();

  await db.schema
    .createIndex("formationApprentissageView_index")
    .unique()
    .on("formationApprentissageView")
    .column("id")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropView("formationScolaireView").materialized().ifExists().execute();
  await db.schema.dropView("formationApprentissageView").materialized().ifExists().execute();

  await db.schema.dropView("formationView").materialized().ifExists().execute();
  await db.schema.dropView("formationNonMaterializedView").ifExists().execute();

  await db.schema.alterTable("dataFormation").addColumn("libelleFiliere", "varchar").execute();

  await db.schema
    .createView("formationNonMaterializedView")
    .as(
      db
        .selectFrom("dataFormation")
        .innerJoin(
          (join) =>
            join
              .selectFrom("diplomeProfessionnel")
              .select(["cfd", "voie"])
              .union(
                db
                  .selectFrom("formationHistorique")
                  .distinct()
                  .select(["formationHistorique.ancienCFD as cfd", "formationHistorique.voie"]),
              )
              .union(
                db
                  .selectFrom("familleMetier")
                  .distinct()
                  .select((sb) => ["cfdFamille", sb.val("scolaire").as("voie")])
                  .$castTo<{ cfd: string; voie: string }>(),
              )
              .as("formations"),
          (join) => join.onRef("formations.cfd", "=", "dataFormation.cfd"),
        )
        .leftJoin("diplomeProfessionnel", "diplomeProfessionnel.cfd", "dataFormation.cfd")
        .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "dataFormation.cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "typeFamille",
          "libelleFiliere",
          "formations.voie",
          "nsf.libelleNsf",
          "nsf.codeNsf",
        ])
        .orderBy("cfd"),
    )
    .execute();

  await db.schema
    .createView("formationView")
    .as(
      db
        .selectFrom("dataFormation")
        .innerJoin(
          (join) =>
            join
              .selectFrom("diplomeProfessionnel")
              .select(["cfd", "voie"])
              .union(
                db
                  .selectFrom("formationHistorique")
                  .distinct()
                  .select(["formationHistorique.ancienCFD as cfd", "formationHistorique.voie"]),
              )
              .union(
                db
                  .selectFrom("familleMetier")
                  .distinct()
                  .select((sb) => ["cfdFamille", sb.val("scolaire").as("voie")])
                  .$castTo<{ cfd: string; voie: string }>(),
              )
              .as("formations"),
          (join) => join.onRef("formations.cfd", "=", "dataFormation.cfd"),
        )
        .leftJoin("diplomeProfessionnel", "diplomeProfessionnel.cfd", "dataFormation.cfd")
        .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "dataFormation.cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "typeFamille",
          "libelleFiliere",
          "formations.voie",
          "nsf.codeNsf",
          "nsf.libelleNsf",
        ])
        .orderBy("cfd"),
    )
    .materialized()
    .execute();

  await db.schema.createIndex("formationView_index").unique().on("formationView").column("id").ifNotExists().execute();

  await db.schema
    .createView("formationScolaireView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom("formationView")
        // @ts-ignore
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "libelleFiliere",
          "codeNsf",
          "libelleNsf",
          "typeFamille",
          "voie",
        ])
        .where((eb) => eb.or([eb("voie", "is", eb.val(null)), eb("voie", "=", eb.val("scolaire"))])),
    )
    .materialized()
    .execute();

  await db.schema
    .createIndex("formationScolaireView_index")
    .unique()
    .on("formationScolaireView")
    .column("id")
    .execute();

  await db.schema
    .createView("formationApprentissageView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom("formationView")
        // @ts-ignore
        .select((sb) => [
          sb.fn("uuid_generate_v4").as("id"),
          "cfd",
          "rncp",
          "libelleFormation",
          "codeNiveauDiplome",
          "dateOuverture",
          "dateFermeture",
          "cpc",
          "cpcSecteur",
          "cpcSousSecteur",
          "libelleFiliere",
          "codeNsf",
          "libelleNsf",
          "typeFamille",
          "voie",
        ])
        .where((eb) => eb.and([eb("voie", "is not", eb.val(null)), eb("voie", "=", eb.val("apprentissage"))])),
    )
    .materialized()
    .execute();

  await db.schema
    .createIndex("formationApprentissageView_index")
    .unique()
    .on("formationApprentissageView")
    .column("id")
    .execute();
};
