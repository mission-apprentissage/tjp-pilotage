import type {Kysely} from "kysely";
import { sql } from "kysely";
import { VoieEnum } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";
import { capaciteAnnee } from "@/modules/data/utils/capaciteAnnee";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { premiersVoeuxAnnee } from "@/modules/data/utils/premiersVoeuxAnnee";
import { countDifferenceCapaciteApprentissage, countDifferenceCapaciteApprentissageColoree, countDifferenceCapaciteScolaire, countDifferenceCapaciteScolaireColoree } from "@/modules/utils/countCapacite";

import { createDemandeConstatViewIndex, dropDemandeConstatViewIndex } from "./utils/indexes/demandeConstatView";
import { disableDemandeConstatViewRefreshTrigger, enableDemandeConstatViewRefreshTrigger } from "./utils/triggers/demandeConstatView";

export const up = async (db: Kysely<unknown>) => {
  await disableDemandeConstatViewRefreshTrigger();
  await dropDemandeConstatViewIndex(db as Kysely<DB>);

  await db.schema.dropView("demandeConstatView").materialized().ifExists().execute();
  await db.schema.dropView("demandeConstatNonMaterializedView").ifExists().execute();

  await db.schema
    .createView("demandeConstatNonMaterializedView")
    .as(
      getKbdClient()
        .selectFrom("latestDemandeView as demande")
        .innerJoin("campagne", "campagne.id", "demande.campagneId")
        .leftJoin("formationEtablissement", (join) =>
          join
            .onRef("formationEtablissement.cfd", "=", "demande.cfd")
            .onRef("formationEtablissement.uai", "=", "demande.uai")
            .onRef("formationEtablissement.codeDispositif", "=", "demande.codeDispositif")
            .on("formationEtablissement.voie", "=", VoieEnum["scolaire"])
        )
        .leftJoin("indicateurEntree as ie_rs_apres", (join) =>
          join
            .onRef("ie_rs_apres.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_apres.rentreeScolaire"), "=", "demande.rentreeScolaire"))
        )
        .leftJoin("indicateurEntree as ie_rs_avant", (join) =>
          join
            .onRef("ie_rs_avant.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_avant.rentreeScolaire"), "=", sql<string>`("demande"."rentreeScolaire"-1)::varchar`))
        )
        .select((eb) => [
          "demande.numero",
          "demande.typeDemande",
          "demande.cfd",
          "demande.codeDispositif",
          "demande.uai",
          "demande.rentreeScolaire",
          "demande.capaciteScolaireActuelle",
          "demande.capaciteScolaire",
          "demande.capaciteScolaireColoreeActuelle",
          "demande.capaciteScolaireColoree",
          "demande.capaciteApprentissageActuelle",
          "demande.capaciteApprentissage",
          "demande.capaciteApprentissageColoreeActuelle",
          "demande.capaciteApprentissageColoree",
          countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
          countDifferenceCapaciteScolaireColoree(eb).as("differenceCapaciteScolaireColoree"),
          countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
          countDifferenceCapaciteApprentissageColoree(eb).as("differenceCapaciteApprentissageColoree"),
          "campagne.annee as annee",
          effectifAnnee({alias: "ie_rs_avant"}).as("effectifEntreeAvant"),
          effectifAnnee({alias: "ie_rs_apres"}).as("effectifEntreeApres"),
          sql<number>`((${effectifAnnee({alias: "ie_rs_apres"})}::integer) - (${effectifAnnee({alias: "ie_rs_avant"})}::integer))`.as("deltaEffectif"),
          capaciteAnnee({alias: "ie_rs_avant"}).as("capaciteEntreeAvant"),
          capaciteAnnee({alias: "ie_rs_apres"}).as("capaciteEntreeApres"),
          sql<number>`((${capaciteAnnee({alias: "ie_rs_apres"})}::integer) - (${capaciteAnnee({alias: "ie_rs_avant"})}::integer))`.as("deltaCapacite"),
          premiersVoeuxAnnee({alias: "ie_rs_avant"}).as("voeuEntreeAvant"),
          premiersVoeuxAnnee({alias: "ie_rs_apres"}).as("voeuEntreeApres"),
        ])
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .where("campagne.statut", "=", CampagneStatutEnum["terminée"])
        .orderBy([
          "rentreeScolaire",
          "annee"
        ])
    ).execute();

  await db.schema
    .createView("demandeConstatView")
    .as(
      getKbdClient()
        .selectFrom("latestDemandeView as demande")
        .innerJoin("campagne", "campagne.id", "demande.campagneId")
        .leftJoin("formationEtablissement", (join) =>
          join
            .onRef("formationEtablissement.cfd", "=", "demande.cfd")
            .onRef("formationEtablissement.uai", "=", "demande.uai")
            .onRef("formationEtablissement.codeDispositif", "=", "demande.codeDispositif")
            .on("formationEtablissement.voie", "=", VoieEnum["scolaire"])
        )
        .leftJoin("indicateurEntree as ie_rs_apres", (join) =>
          join
            .onRef("ie_rs_apres.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_apres.rentreeScolaire"), "=", "demande.rentreeScolaire"))
        )
        .leftJoin("indicateurEntree as ie_rs_avant", (join) =>
          join
            .onRef("ie_rs_avant.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_avant.rentreeScolaire"), "=", sql<string>`("demande"."rentreeScolaire"-1)::varchar`))
        )
        .select((eb) => [
          "demande.numero",
          "demande.typeDemande",
          "demande.cfd",
          "demande.codeDispositif",
          "demande.uai",
          "demande.rentreeScolaire",
          "demande.capaciteScolaireActuelle",
          "demande.capaciteScolaire",
          "demande.capaciteScolaireColoreeActuelle",
          "demande.capaciteScolaireColoree",
          "demande.capaciteApprentissageActuelle",
          "demande.capaciteApprentissage",
          "demande.capaciteApprentissageColoreeActuelle",
          "demande.capaciteApprentissageColoree",
          countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
          countDifferenceCapaciteScolaireColoree(eb).as("differenceCapaciteScolaireColoree"),
          countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
          countDifferenceCapaciteApprentissageColoree(eb).as("differenceCapaciteApprentissageColoree"),
          "campagne.annee as annee",
          effectifAnnee({alias: "ie_rs_avant"}).as("effectifEntreeAvant"),
          effectifAnnee({alias: "ie_rs_apres"}).as("effectifEntreeApres"),
          sql<number>`(${effectifAnnee({alias: "ie_rs_apres"})}::integer - ${effectifAnnee({alias: "ie_rs_avant"})}::integer)`.as("deltaEffectif"),
          capaciteAnnee({alias: "ie_rs_avant"}).as("capaciteEntreeAvant"),
          capaciteAnnee({alias: "ie_rs_apres"}).as("capaciteEntreeApres"),
          sql<number>`(${capaciteAnnee({alias: "ie_rs_apres"})}::integer - ${capaciteAnnee({alias: "ie_rs_avant"})}::integer)`.as("deltaCapacite"),
          premiersVoeuxAnnee({alias: "ie_rs_avant"}).as("voeuEntreeAvant"),
          premiersVoeuxAnnee({alias: "ie_rs_apres"}).as("voeuEntreeApres"),
        ])
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .where("campagne.statut", "=", CampagneStatutEnum["terminée"])
        .orderBy([
          "rentreeScolaire",
          "annee"
        ])
    )
    .materialized()
    .execute();

  await enableDemandeConstatViewRefreshTrigger();
  await createDemandeConstatViewIndex(db as Kysely<DB>);
};

export const down = async (db: Kysely<unknown>) => {

  await disableDemandeConstatViewRefreshTrigger();
  await dropDemandeConstatViewIndex(db as Kysely<DB>);

  await db.schema.dropView("demandeConstatView").materialized().ifExists().execute();
  await db.schema.dropView("demandeConstatNonMaterializedView").ifExists().execute();

  await db.schema
    .createView("demandeConstatNonMaterializedView")
    .as(
      getKbdClient()
        .selectFrom("latestDemandeView as demande")
        .innerJoin("campagne", "campagne.id", "demande.campagneId")
        .leftJoin("formationEtablissement", (join) =>
          join
            .onRef("formationEtablissement.cfd", "=", "demande.cfd")
            .onRef("formationEtablissement.uai", "=", "demande.uai")
            .onRef("formationEtablissement.codeDispositif", "=", "demande.codeDispositif")
            .on("formationEtablissement.voie", "=", VoieEnum["scolaire"])
        )
        .leftJoin("indicateurEntree as ie_rs_apres", (join) =>
          join
            .onRef("ie_rs_apres.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_apres.rentreeScolaire"), "=", "demande.rentreeScolaire"))
        )
        .leftJoin("indicateurEntree as ie_rs_avant", (join) =>
          join
            .onRef("ie_rs_avant.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_avant.rentreeScolaire"), "=", sql<string>`("demande"."rentreeScolaire"-1)::varchar`))
        )
        .select((eb) => [
          "demande.numero",
          "demande.typeDemande",
          "demande.cfd",
          "demande.codeDispositif",
          "demande.uai",
          "demande.rentreeScolaire",
          "demande.capaciteScolaireActuelle",
          "demande.capaciteScolaire",
          "demande.capaciteScolaireColoreeActuelle",
          "demande.capaciteScolaireColoree",
          "demande.capaciteApprentissageActuelle",
          "demande.capaciteApprentissage",
          "demande.capaciteApprentissageColoreeActuelle",
          "demande.capaciteApprentissageColoree",
          countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
          countDifferenceCapaciteScolaireColoree(eb).as("differenceCapaciteScolaireColoree"),
          countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
          countDifferenceCapaciteApprentissageColoree(eb).as("differenceCapaciteApprentissageColoree"),
          "campagne.annee as annee",
          effectifAnnee({alias: "ie_rs_avant"}).as("effectifEntreeAvant"),
          effectifAnnee({alias: "ie_rs_apres"}).as("effectifEntreeApres"),
          sql<number>`((${effectifAnnee({alias: "ie_rs_apres"})}::integer) - (${effectifAnnee({alias: "ie_rs_avant"})}::integer))`.as("deltaEffectif"),
          capaciteAnnee({alias: "ie_rs_avant"}).as("capaciteEntreeAvant"),
          capaciteAnnee({alias: "ie_rs_apres"}).as("capaciteEntreeApres"),
          sql<number>`((${capaciteAnnee({alias: "ie_rs_apres"})}::integer) - (${capaciteAnnee({alias: "ie_rs_avant"})}::integer))`.as("deltaCapacite"),
          premiersVoeuxAnnee({alias: "ie_rs_avant"}).as("voeuEntreeAvant"),
          premiersVoeuxAnnee({alias: "ie_rs_apres"}).as("voeuEntreeApres"),
        ])
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .orderBy([
          "rentreeScolaire",
          "annee"
        ])
    ).execute();

  await db.schema
    .createView("demandeConstatView")
    .as(
      getKbdClient()
        .selectFrom("latestDemandeView as demande")
        .innerJoin("campagne", "campagne.id", "demande.campagneId")
        .leftJoin("formationEtablissement", (join) =>
          join
            .onRef("formationEtablissement.cfd", "=", "demande.cfd")
            .onRef("formationEtablissement.uai", "=", "demande.uai")
            .onRef("formationEtablissement.codeDispositif", "=", "demande.codeDispositif")
            .on("formationEtablissement.voie", "=", VoieEnum["scolaire"])
        )
        .leftJoin("indicateurEntree as ie_rs_apres", (join) =>
          join
            .onRef("ie_rs_apres.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_apres.rentreeScolaire"), "=", "demande.rentreeScolaire"))
        )
        .leftJoin("indicateurEntree as ie_rs_avant", (join) =>
          join
            .onRef("ie_rs_avant.formationEtablissementId", "=", "formationEtablissement.id")
            .on(eb => eb(eb.ref("ie_rs_avant.rentreeScolaire"), "=", sql<string>`("demande"."rentreeScolaire"-1)::varchar`))
        )
        .select((eb) => [
          "demande.numero",
          "demande.typeDemande",
          "demande.cfd",
          "demande.codeDispositif",
          "demande.uai",
          "demande.rentreeScolaire",
          "demande.capaciteScolaireActuelle",
          "demande.capaciteScolaire",
          "demande.capaciteScolaireColoreeActuelle",
          "demande.capaciteScolaireColoree",
          "demande.capaciteApprentissageActuelle",
          "demande.capaciteApprentissage",
          "demande.capaciteApprentissageColoreeActuelle",
          "demande.capaciteApprentissageColoree",
          countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
          countDifferenceCapaciteScolaireColoree(eb).as("differenceCapaciteScolaireColoree"),
          countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
          countDifferenceCapaciteApprentissageColoree(eb).as("differenceCapaciteApprentissageColoree"),
          "campagne.annee as annee",
          effectifAnnee({alias: "ie_rs_avant"}).as("effectifEntreeAvant"),
          effectifAnnee({alias: "ie_rs_apres"}).as("effectifEntreeApres"),
          sql<number>`(${effectifAnnee({alias: "ie_rs_apres"})}::integer - ${effectifAnnee({alias: "ie_rs_avant"})}::integer)`.as("deltaEffectif"),
          capaciteAnnee({alias: "ie_rs_avant"}).as("capaciteEntreeAvant"),
          capaciteAnnee({alias: "ie_rs_apres"}).as("capaciteEntreeApres"),
          sql<number>`(${capaciteAnnee({alias: "ie_rs_apres"})}::integer - ${capaciteAnnee({alias: "ie_rs_avant"})}::integer)`.as("deltaCapacite"),
          premiersVoeuxAnnee({alias: "ie_rs_avant"}).as("voeuEntreeAvant"),
          premiersVoeuxAnnee({alias: "ie_rs_apres"}).as("voeuEntreeApres"),
        ])
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .orderBy([
          "rentreeScolaire",
          "annee"
        ])
    )
    .materialized()
    .execute();

  await enableDemandeConstatViewRefreshTrigger();
  await createDemandeConstatViewIndex(db as Kysely<DB>);
};
