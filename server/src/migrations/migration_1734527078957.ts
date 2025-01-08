/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  const subFormationView = db
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
      "dataFormation.codeNsf",
    ]);

  const transitionDemographique = db
    .selectFrom(
      db
        .selectFrom(subFormationView.as("formationView"))
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .leftJoin("formationRome", "formationRome.cfd", "formationView.cfd")
        .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
        .select((sb) => [
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nb romes total"),
          sql<number>`count(distinct case when ${sb.ref(
            "rome.transitionDemographique",
          )} then ${sb.ref("formationRome.codeRome")} end)`.as("nb romes TD"),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("sous_requete"),
    )
    .select((sb) => [sb.ref("sous_requete.cfd").as("cfd")])
    .where("nb romes total", ">", 0)
    .whereRef("nb romes total", "=", "nb romes TD");

  const transitionEcologique = db
    .selectFrom(
      db
        .selectFrom(subFormationView.as("formationView"))
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .leftJoin("formationRome", "formationRome.cfd", "formationView.cfd")
        .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
        .select((sb) => [
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nb romes total"),
          sql<number>`count(distinct case when ${sb.ref(
            "rome.transitionEcologique",
          )} then ${sb.ref("formationRome.codeRome")} end)`.as("nb romes TE"),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("sous_requete"),
    )
    .select((sb) => [sb.ref("sous_requete.cfd").as("cfd")])
    .where("nb romes total", ">", 0)
    .whereRef("nb romes total", "=", "nb romes TE");

  const transitionNumerique = db
    .selectFrom(
      db
        .selectFrom(subFormationView.as("formationView"))
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .leftJoin("formationRome", "formationRome.cfd", "formationView.cfd")
        .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
        .select((sb) => [
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nb romes total"),
          sql<number>`count(distinct case when ${sb.ref(
            "rome.transitionNumerique",
          )} then ${sb.ref("formationRome.codeRome")} end)`.as("nb romes TN"),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("sous_requete"),
    )
    .select((sb) => [sb.ref("sous_requete.cfd").as("cfd")])
    .where("nb romes total", ">", 0)
    .whereRef("nb romes total", "=", "nb romes TN");

  await db.schema.dropView("formationScolaireView").materialized().ifExists().execute();

  await db.schema.dropView("formationApprentissageView").materialized().ifExists().execute();

  await db.schema.dropView("formationView").materialized().ifExists().execute();
  await db.schema.dropView("formationNonMaterializedView").ifExists().execute();

  await db.schema
    .createView("formationNonMaterializedView")
    .as(
      db
        .with("subFormationView", () => subFormationView)
        .with("transitionNumerique", () => transitionNumerique)
        .with("transitionEcologique", () => transitionEcologique)
        .with("transitionDemographique", () => transitionDemographique)
        .selectFrom("subFormationView")
        .leftJoin("transitionNumerique", "subFormationView.cfd", "transitionNumerique.cfd")
        .leftJoin("transitionEcologique", "subFormationView.cfd", "transitionEcologique.cfd")
        .leftJoin("transitionDemographique", "subFormationView.cfd", "transitionDemographique.cfd")
        .selectAll("subFormationView")
        .select((eb) => [
          sql<boolean>`${eb.ref("transitionNumerique.cfd")} is not null`.as("isTransitionNumerique"),
          sql<boolean>`${eb.ref("transitionEcologique.cfd")} is not null`.as("isTransitionEcologique"),
          sql<boolean>`${eb.ref("transitionDemographique.cfd")} is not null`.as("isTransitionDemographique"),
        ])
        .orderBy("cfd"),
    )
    .execute();

  await db.schema
    .createView("formationView")
    .as(
      db
        .with("subFormationView", () => subFormationView)
        .with("transitionNumerique", () => transitionNumerique)
        .with("transitionEcologique", () => transitionEcologique)
        .with("transitionDemographique", () => transitionDemographique)
        .selectFrom("subFormationView")
        .leftJoin("transitionNumerique", "subFormationView.cfd", "transitionNumerique.cfd")
        .leftJoin("transitionEcologique", "subFormationView.cfd", "transitionEcologique.cfd")
        .leftJoin("transitionDemographique", "subFormationView.cfd", "transitionDemographique.cfd")
        .selectAll("subFormationView")
        .select((eb) => [
          sql<boolean>`${eb.ref("transitionNumerique.cfd")} is not null`.as("isTransitionNumerique"),
          sql<boolean>`${eb.ref("transitionEcologique.cfd")} is not null`.as("isTransitionEcologique"),
          sql<boolean>`${eb.ref("transitionDemographique.cfd")} is not null`.as("isTransitionDemographique"),
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
          "typeFamille",
          "voie",
          "isTransitionNumerique",
          "isTransitionEcologique",
          "isTransitionDemographique",
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
          "typeFamille",
          "voie",
          "isTransitionNumerique",
          "isTransitionEcologique",
          "isTransitionDemographique",
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
          "dataFormation.codeNsf",
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
          "dataFormation.codeNsf",
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
