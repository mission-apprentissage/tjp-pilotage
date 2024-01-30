import { ExpressionBuilder, sql } from "kysely";

import { DB, kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { CURRENT_IJ_MILLESIME } from "../../../import/domain/CURRENT_IJ_MILLESIME";
import { capaciteAnnee } from "../../utils/capaciteAnnee";
import { effectifAnnee } from "../../utils/effectifAnnee";
import { hasContinuum } from "../../utils/hasContinuum";
import { notAnneeCommune } from "../../utils/notAnneeCommune";
import {
  isHistoriqueCoExistant,
  notHistoriqueUnlessCoExistant,
} from "../../utils/notHistorique";
import {
  notPerimetreIJAcademie,
  notPerimetreIJDepartement,
  notPerimetreIJEtablissement,
  notPerimetreIJRegion,
} from "../../utils/notPerimetreIJ";
import { withTauxDevenirFavorableReg } from "../../utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../utils/tauxRemplissage";

const findFormationsInDb = async ({
  offset = 0,
  limit = 20,
  rentreeScolaire = ["2022"],
  millesimeSortie = CURRENT_IJ_MILLESIME,
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeDiplome,
  codeDispositif,
  commune,
  cfd,
  cfdFamille,
  orderBy,
  withEmptyFormations = true,
  withAnneeCommune,
  cpc,
  cpcSecteur,
  cpcSousSecteur,
  libelleFiliere,
}: {
  offset?: number;
  limit?: number;
  rentreeScolaire?: string[];
  millesimeSortie?: string;
  codeRegion?: string[];
  codeAcademie?: string[];
  codeDepartement?: string[];
  codeDiplome?: string[];
  codeDispositif?: string[];
  commune?: string[];
  cfd?: string[];
  cfdFamille?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
  withEmptyFormations?: boolean;
  withAnneeCommune?: string;
  cpc?: string[];
  cpcSecteur?: string[];
  cpcSousSecteur?: string[];
  libelleFiliere?: string[];
} = {}) => {
  const query = kdb
    .selectFrom("formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "formationView.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "in", rentreeScolaire)
    )
    .leftJoin("indicateurSortie", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurSortie.formationEtablissementId"
        )
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin(
      "formationHistorique",
      "formationHistorique.ancienCFD",
      "formationView.cfd"
    )
    .select([
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.typeFamille",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "formationView.cpcSousSecteur",
      sql<number>`COUNT(*) OVER()`.as("count"),
      "familleMetier.libelleFamille",
      "libelleDispositif",
      "codeDispositif",
      "libelleNiveauDiplome",
      "indicateurEntree.rentreeScolaire",
      sql<number>`COUNT("indicateurEntree"."rentreeScolaire")
      `.as("nbEtablissement"),
      sql<number>`max("indicateurEntree"."anneeDebut")`.as("anneeDebut"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
        annee: sql`'0'`,
      })})`.as("effectif1"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
        annee: sql`'1'`,
      })})`.as("effectif2"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
        annee: sql`'2'`,
      })})`.as("effectif3"),
      sql<number>`SUM(${capaciteAnnee({ alias: "indicateurEntree" })})
      `.as("capacite"),
      sql<number>`SUM(${capaciteAnnee({
        alias: "indicateurEntree",
        annee: sql`'0'`,
      })})`.as("capacite1"),
      sql<number>`SUM(${capaciteAnnee({
        alias: "indicateurEntree",
        annee: sql`'1'`,
      })})`.as("capacite2"),
      sql<number>`SUM(${capaciteAnnee({
        alias: "indicateurEntree",
        annee: sql`'2'`,
      })})`.as("capacite3"),
      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
    ])
    .select((eb) => [
      hasContinuum({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "etablissement.codeRegion",
      }).as("continuum"),
      withPoursuiteReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxPoursuite"),
      withInsertionReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxInsertion"),
      withTauxDevenirFavorableReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.dispositifId",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxDevenirFavorable"),
      isHistoriqueCoExistant(eb, rentreeScolaire[0]).as(
        "isHistoriqueCoExistant"
      ),
      "formationHistorique.codeFormationDiplome as formationRenovee",
    ])
    .where(notPerimetreIJEtablissement)
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire[0]))
    .where((eb) =>
      eb.or([
        eb("indicateurEntree.rentreeScolaire", "is not", null),
        withEmptyFormations
          ? eb.not(
              eb.exists(
                eb
                  .selectFrom("formationEtablissement as fe")
                  .select("fe.cfd")
                  .distinct()
                  .innerJoin(
                    "indicateurEntree",
                    "id",
                    "formationEtablissementId"
                  )
                  .where("rentreeScolaire", "in", rentreeScolaire)
                  .whereRef(
                    "fe.dispositifId",
                    "=",
                    "formationEtablissement.dispositifId"
                  )
                  .whereRef("fe.cfd", "=", "formationEtablissement.cfd")
              )
            )
          : sql<boolean>`false`,
      ])
    )
    .groupBy([
      "formationEtablissement.cfd",
      "formationView.id",
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.typeFamille",
      "formationView.dateFermeture",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "formationView.cpcSousSecteur",
      "formationHistorique.codeFormationDiplome",
      "indicateurEntree.rentreeScolaire",
      "dispositif.libelleDispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId",
      "libelleFamille",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("etablissement.codeRegion", "in", codeRegion);
    })
    .$call((q) => {
      if (!codeAcademie) return q;
      return q.where("etablissement.codeAcademie", "in", codeAcademie);
    })
    .$call((q) => {
      if (!codeDepartement) return q;
      return q.where("etablissement.codeDepartement", "in", codeDepartement);
    })
    .$call((q) => {
      if (!cfd) return q;
      return q.where("formationView.cfd", "in", cfd);
    })
    .$call((q) => {
      if (!commune) return q;
      return q.where("etablissement.commune", "in", commune);
    })
    .$call((q) => {
      if (!codeDispositif) return q;
      return q.where("dispositif.codeDispositif", "in", codeDispositif);
    })
    .$call((q) => {
      if (!codeDiplome) return q;
      return q.where("formationView.codeNiveauDiplome", "in", codeDiplome);
    })
    .$call((q) => {
      if (!cfdFamille) return q;
      return q.where((w) =>
        w.or([
          w("familleMetier.cfdFamille", "in", cfdFamille),
          w.and([
            w("formationView.typeFamille", "=", "2nde_commune"),
            w("formationView.cfd", "in", cfdFamille),
          ]),
        ])
      );
    })
    .$call((q) => {
      if (!cpc) return q;
      return q.where("formationView.cpc", "in", cpc);
    })
    .$call((q) => {
      if (!cpcSecteur) return q;
      return q.where("formationView.cpcSecteur", "in", cpcSecteur);
    })
    .$call((q) => {
      if (!cpcSousSecteur) return q;
      return q.where("formationView.cpcSousSecteur", "in", cpcSousSecteur);
    })
    .$call((q) => {
      if (!libelleFiliere) return q;
      return q.where("formationView.libelleFiliere", "in", libelleFiliere);
    })
    .$call((q) => {
      if (!withAnneeCommune || withAnneeCommune === "false")
        return q.where(notAnneeCommune);
      return q;
    })
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .orderBy("libelleFormation", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .orderBy("libelleDispositif", "asc")
    .orderBy("formationView.cfd", "asc")
    .orderBy("nbEtablissement", "asc")
    .offset(offset)
    .limit(limit);

  const res = await query.execute();

  return {
    count: res[0]?.count ?? 0,
    formations: res.map(cleanNull),
  };
};

const findFiltersInDb = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  commune,
  cfdFamille,
  cfd,
  codeDiplome,
  codeDispositif,
  cpc,
  cpcSecteur,
  cpcSousSecteur,
  libelleFiliere,
  rentreeScolaire = ["2022"],
}: {
  codeRegion?: string[];
  codeAcademie?: string[];
  codeDepartement?: string[];
  codeDiplome?: string[];
  codeDispositif?: string[];
  commune?: string[];
  cfd?: string[];
  cfdFamille?: string[];
  cpc?: string[];
  cpcSecteur?: string[];
  cpcSousSecteur?: string[];
  libelleFiliere?: string[];
  rentreeScolaire?: string[];
}) => {
  const base = kdb
    .selectFrom("formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId"
    )
    .leftJoin("familleMetier", "familleMetier.cfdFamille", "formationView.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
    .leftJoin("academie", "academie.codeAcademie", "etablissement.codeAcademie")
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire[0]))
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const inCodeAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
    if (!codeAcademie) return sql<true>`true`;
    return eb("academie.codeAcademie", "in", codeAcademie);
  };
  const inCodeDepartement = (eb: ExpressionBuilder<DB, "departement">) => {
    if (!codeDepartement) return sql<true>`true`;
    return eb("departement.codeDepartement", "in", codeDepartement);
  };

  const inCommune = (eb: ExpressionBuilder<DB, "etablissement">) => {
    if (!commune) return sql<true>`true`;
    return eb("etablissement.commune", "in", commune);
  };

  const inCodeRegion = (eb: ExpressionBuilder<DB, "region">) => {
    if (!codeRegion) return sql<true>`true`;
    return eb("region.codeRegion", "in", codeRegion);
  };

  const inCfdFamille = (
    eb: ExpressionBuilder<DB, "familleMetier" | "formationView">
  ) => {
    if (!cfdFamille) return sql<true>`true`;
    return eb.or([eb("familleMetier.cfdFamille", "in", cfdFamille)]);
  };

  const inCfd = (eb: ExpressionBuilder<DB, "formationView">) => {
    if (!cfd) return sql<true>`true`;
    return eb("formationView.cfd", "in", cfd);
  };

  const inCodeDiplome = (eb: ExpressionBuilder<DB, "formationView">) => {
    if (!codeDiplome) return sql<true>`true`;
    return eb("formationView.codeNiveauDiplome", "in", codeDiplome);
  };

  const inCodeDispositif = (
    eb: ExpressionBuilder<DB, "formationEtablissement">
  ) => {
    if (!codeDispositif) return sql<true>`true`;
    return eb("formationEtablissement.dispositifId", "in", codeDispositif);
  };

  const inCpc = (eb: ExpressionBuilder<DB, "formationView">) => {
    if (!cpc) return sql<true>`true`;
    return eb("formationView.cpc", "in", cpc);
  };

  const inCpcSecteur = (eb: ExpressionBuilder<DB, "formationView">) => {
    if (!cpcSecteur) return sql<true>`true`;
    return eb("formationView.cpcSecteur", "in", cpcSecteur);
  };

  const regions = await base
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .where(notPerimetreIJRegion)
    .execute();

  const academies = await base
    .select([
      "academie.libelleAcademie as label",
      "academie.codeAcademie as value",
    ])
    .where("academie.codeAcademie", "is not", null)
    .where(notPerimetreIJAcademie)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb), inCodeDepartement(eb), inCommune(eb)]),
        codeAcademie
          ? eb("academie.codeAcademie", "in", codeAcademie)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const departements = await base
    .select([
      "departement.libelleDepartement as label",
      "departement.codeDepartement as value",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(notPerimetreIJDepartement)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb), inCodeAcademie(eb), inCommune(eb)]),
        codeDepartement
          ? eb("departement.codeDepartement", "in", codeDepartement)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const communes = await base
    .select([
      "etablissement.commune as label",
      "etablissement.commune as value",
    ])
    .where("etablissement.commune", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb), inCodeAcademie(eb), inCodeDepartement(eb)]),
        commune
          ? eb("etablissement.commune", "in", commune)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const diplomes = await base
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCfdFamille(eb), inCfd(eb), inCodeDispositif(eb)]),
        codeDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeDiplome)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const dispositifs = await base
    .select([
      "dispositif.libelleDispositif as label",
      "dispositif.codeDispositif as value",
    ])
    .where("dispositif.codeDispositif", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCfdFamille(eb), inCfd(eb), inCodeDiplome(eb)]),
        codeDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeDiplome)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const familles = await base
    .select((eb) => [
      sql<string>`CONCAT(
        ${eb.ref("familleMetier.libelleFamille")},
        ' (',
        ${eb.ref("niveauDiplome.libelleNiveauDiplome")},
        ')'
      )`.as("label"),
      "familleMetier.cfdFamille as value",
    ])
    .where("familleMetier.cfdFamille", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCfd(eb), inCodeDiplome(eb), inCodeDispositif(eb)]),
        cfdFamille
          ? eb("familleMetier.cfdFamille", "in", cfdFamille)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const formations = await base
    .select([
      sql`CONCAT("formationView"."libelleFormation", ' (', "niveauDiplome"."libelleNiveauDiplome", ')')
      `.as("label"),
      "formationView.cfd as value",
    ])
    .where("formationView.cfd", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCfdFamille(eb), inCodeDiplome(eb), inCodeDispositif(eb)]),
        cfd ? eb("formationView.cfd", "in", cfd) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const cpcs = await base
    .select(["formationView.cpc as label", "formationView.cpc as value"])
    .where("formationView.cpc", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([]),
        cpc ? eb("formationView.cpc", "in", cpc) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const cpcSecteurs = await base
    .select([
      "formationView.cpcSecteur as label",
      "formationView.cpcSecteur as value",
    ])
    .where("formationView.cpcSecteur", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCpc(eb)]),
        cpcSecteur
          ? eb("formationView.cpcSecteur", "in", cpcSecteur)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const cpcSousSecteurs = await base
    .select([
      "formationView.cpcSousSecteur as label",
      "formationView.cpcSousSecteur as value",
    ])
    .where("formationView.cpcSousSecteur", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCpc(eb), inCpcSecteur(eb)]),
        cpcSousSecteur
          ? eb("formationView.cpcSousSecteur", "in", cpcSousSecteur)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const libelleFilieres = await base
    .select([
      "formationView.libelleFiliere as label",
      "formationView.libelleFiliere as value",
    ])
    .where("formationView.libelleFiliere", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([]),
        libelleFiliere
          ? eb("formationView.libelleFiliere", "in", libelleFiliere)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  return {
    regions: regions.map(cleanNull),
    departements: departements.map(cleanNull),
    academies: academies.map(cleanNull),
    communes: communes.map(cleanNull),
    diplomes: diplomes.map(cleanNull),
    dispositifs: dispositifs.map(cleanNull),
    familles: familles.map(cleanNull),
    formations: formations.map(cleanNull),
    cpcs: cpcs.map(cleanNull),
    cpcSecteurs: cpcSecteurs.map(cleanNull),
    cpcSousSecteurs: cpcSousSecteurs.map(cleanNull),
    libelleFilieres: libelleFilieres.map(cleanNull),
  };
};

export const dependencies = {
  findFormationsInDb,
  findFiltersInDb,
};
