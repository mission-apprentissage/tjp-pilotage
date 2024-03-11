import Boom from "@hapi/boom";
import { expressionBuilder, sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { DB, kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getRentreeScolaire } from "../../services/getRentreeScolaire";
import { capaciteAnnee } from "../../utils/capaciteAnnee";
import { effectifAnnee } from "../../utils/effectifAnnee";
import { hasContinuum } from "../../utils/hasContinuum";
import { premiersVoeuxAnnee } from "../../utils/premiersVoeuxAnnee";
import { selectTauxDevenirFavorable } from "../../utils/tauxDevenirFavorable";
import {
  selectTauxInsertion6mois,
  withInsertionReg,
} from "../../utils/tauxInsertion6mois";
import {
  selectTauxPoursuite,
  withPoursuiteReg,
} from "../../utils/tauxPoursuite";
import {
  selectTauxPression,
  withTauxPressionDep,
  withTauxPressionNat,
  withTauxPressionReg,
} from "../../utils/tauxPression";
import { selectTauxRemplissage } from "../../utils/tauxRemplissage";

const getBase = ({
  uai,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  uai: string;
  rentreeScolaire?: string;
}) =>
  kdb
    .selectFrom("formationEtablissement")
    .innerJoin(
      "dataEtablissement",
      "dataEtablissement.uai",
      "formationEtablissement.UAI"
    )
    .innerJoin(
      "dataFormation",
      "dataFormation.cfd",
      "formationEtablissement.cfd"
    )
    .innerJoin(
      "niveauDiplome as nd",
      "nd.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("dispositif", (join) =>
      join
        .onRef(
          "dispositif.codeDispositif",
          "=",
          "formationEtablissement.dispositifId"
        )
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "indicateurEntree.formationEtablissementId",
          "=",
          "formationEtablissement.id"
        )
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .where((w) =>
      w.and([
        w.or([
          w("indicateurEntree.rentreeScolaire", "=", rentreeScolaire),
          w("indicateurEntree.rentreeScolaire", "is", null),
        ]),
        w("formationEtablissement.UAI", "=", uai),
      ])
    );

const getFormationsParNiveauDeDiplome = async ({
  uai,
  codeNiveauDiplome,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
}) =>
  getBase({ uai })
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "libelleNiveauDiplome",
      "libelleFormation",
      "voie",
      "libelleDispositif",
      "dataFormation.codeNiveauDiplome",
      "dataFormation.cfd",
      "codeDispositif",
      "dataFormation.typeFamille",
    ])
    .orderBy([
      "libelleNiveauDiplome asc",
      "libelleFormation asc",
      "libelleDispositif",
    ])
    .$call((q) => {
      if (codeNiveauDiplome?.length)
        return q.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return q;
    })
    .execute();

const getChiffresIj = async ({
  uai,
  codeNiveauDiplome,
  millesimeSortie = CURRENT_IJ_MILLESIME,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
  millesimeSortie?: string;
}) => {
  const eb2 = expressionBuilder<DB, keyof DB>();
  return getBase({ uai })
    .innerJoin(
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      "millesimeSortie",
      "voie",
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
      selectTauxDevenirFavorable("indicateurSortie").as("tauxDevenirFavorable"),
      withInsertionReg({
        eb: eb2,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxPoursuiteRegional"),
      withPoursuiteReg({
        eb: eb2,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("tauxInsertionRegional"),
      "dataFormation.cfd",
      "codeDispositif",
      "effectifSortie",
      "nbSortants",
      "nbPoursuiteEtudes",
      "nbInsertion6mois",
      hasContinuum({
        eb: eb2,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "dataEtablissement.codeRegion",
      }).as("continuum"),
    ])
    .$call((q) => {
      if (codeNiveauDiplome?.length)
        return q.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return q;
    })
    .groupBy([
      "dataEtablissement.uai",
      "dataFormation.cfd",
      "formationEtablissement.dispositifId",
      "formationEtablissement.cfd",
      "voie",
      "millesimeSortie",
      "nbPoursuiteEtudes",
      "nbInsertion6mois",
      "effectifSortie",
      "nbSortants",
      "codeDispositif",
    ])
    .execute();
};

const getChiffresEntree = async ({
  uai,
  codeNiveauDiplome,
  rentreeScolaire,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire: string;
}) => {
  const eb2 = expressionBuilder<DB, keyof DB>();

  return getBase({ uai })
    .innerJoin("indicateurEntree as ie", (join) =>
      join.onRef(
        "ie.formationEtablissementId",
        "=",
        "formationEtablissement.id"
      )
    )
    .where("ie.rentreeScolaire", "in", [
      rentreeScolaire,
      getRentreeScolaire({ rentreeScolaire, offset: -1 }),
      getRentreeScolaire({ rentreeScolaire, offset: -2 }),
    ])
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("dataEtablissement.uai")},
        ${eb.ref("dataFormation.cfd")},
        COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
        ${eb.ref("formationEtablissement.voie")}
      )`.as("offre"),
      eb.fn
        .coalesce("ie.rentreeScolaire", sql<string>`${rentreeScolaire}`)
        .as("rentreeScolaire"),
      "voie",
      "uai",
      "dataFormation.cfd",
      "dispositifId",
      sql<string[]>`COALESCE(${eb.ref("ie.effectifs")}, '[]')`.as("effectifs"),
      premiersVoeuxAnnee({ alias: "ie" }).as("premiersVoeux"),
      capaciteAnnee({ alias: "ie" }).as("capacite"),
      effectifAnnee({ alias: "ie" }).as("effectifEntree"),
      effectifAnnee({ alias: "ie", annee: sql`'0'` }).as("effectifAnnee1"),
      effectifAnnee({ alias: "ie", annee: sql`'1'` }).as("effectifAnnee2"),
      effectifAnnee({ alias: "ie", annee: sql`'2'` }).as("effectifAnnee3"),
      selectTauxPression("ie", "nd", true).as("tauxPression"),
      withTauxPressionNat({
        eb: eb2,
        cfdRef: "dataFormation.cfd",
        codeDispositifRef: "codeDispositif",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionNational"),
      withTauxPressionReg({
        eb: eb2,
        cfdRef: "dataFormation.cfd",
        codeDispositifRef: "codeDispositif",
        codeRegionRef: "dataEtablissement.codeRegion",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionRegional"),
      withTauxPressionDep({
        eb: eb2,
        cfdRef: "dataFormation.cfd",
        codeDispositifRef: "codeDispositif",
        codeDepartementRef: "dataEtablissement.codeDepartement",
        indicateurEntreeAlias: "ie",
        withTauxDemande: true,
      }).as("tauxPressionDepartemental"),
      selectTauxRemplissage("ie").as("tauxRemplissage"),
    ])
    .distinct()
    .$call((q) => {
      if (codeNiveauDiplome?.length)
        return q.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return q;
    })
    .groupBy([
      "ie.rentreeScolaire",
      "formationEtablissement.voie",
      "formationEtablissement.dispositifId",
      "codeDispositif",
      "dataEtablissement.uai",
      "dataFormation.cfd",
      "nd.codeNiveauDiplome",
      "ie.capacites",
      "ie.anneeDebut",
      "ie.premiersVoeux",
      "ie.effectifs",
    ])
    .execute();
};

const getFilters = async ({ uai }: { uai: string }) =>
  getBase({
    uai,
  })
    .select((eb) => [
      "libelleNiveauDiplome as label",
      "dataFormation.codeNiveauDiplome as value",
      sql<number>`COUNT(DISTINCT CONCAT(
             ${eb.ref("dataEtablissement.uai")},
             ${eb.ref("dataFormation.cfd")},
             COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
             ${eb.ref("formationEtablissement.voie")}
           ))`.as("nbOffres"),
    ])
    .groupBy(["label", "value"])
    .orderBy(["label asc"])
    .$castTo<{
      label: string;
      value: string;
      nbOffres: number;
    }>()
    .execute();

const getEtablissement = async ({ uai }: { uai: string }) =>
  kdb
    .selectFrom("dataEtablissement")
    .where("uai", "=", uai)
    .where("codeRegion", "is not", null)
    .where("codeAcademie", "is not", null)
    .where("codeDepartement", "is not", null)
    .select([
      "uai",
      "libelleEtablissement",
      "codeRegion",
      "codeAcademie",
      "codeDepartement",
    ])
    .$castTo<{
      uai: string;
      libelleEtablissement: string;
      codeRegion: string;
      codeAcademie: string;
      codeDepartement: string;
    }>()
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Uai introuvable : ${uai}`);
    });

const getAnalyseDetailleeEtablissementQuery = async ({
  uai,
  rentreeScolaire = CURRENT_RENTREE,
  codeNiveauDiplome,
}: {
  uai: string;
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
}) => {
  const etablissement = await getEtablissement({ uai });

  const formations = await getFormationsParNiveauDeDiplome({
    uai,
    codeNiveauDiplome,
  });
  const chiffresIJ = await getChiffresIj({
    uai,
    codeNiveauDiplome,
  });
  const chiffresEntree = await getChiffresEntree({
    uai,
    rentreeScolaire,
    codeNiveauDiplome,
  });
  const filters = await getFilters({ uai });

  return {
    etablissement: cleanNull(etablissement),
    formations: formations.map(cleanNull),
    chiffresIJ: chiffresIJ.map(cleanNull),
    chiffresEntree: chiffresEntree.map(cleanNull),
    filters: {
      diplomes: filters.map(cleanNull),
    },
  };
};

export const dependencies = { getAnalyseDetailleeEtablissementQuery };