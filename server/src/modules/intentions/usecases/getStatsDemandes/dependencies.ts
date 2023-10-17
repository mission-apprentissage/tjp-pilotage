import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { nbEtablissementFormationRegion } from "../../../data/queries/utils/nbEtablissementFormationRegion";
import { selectTauxDevenirFavorable } from "../../../data/queries/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "../../../data/queries/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../../data/queries/utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "../../../data/queries/utils/tauxPression";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteScolaire,
} from "../../utils/countCapacite";
import {
  isRegionVisible,
  isStatsDemandeVisible,
} from "../../utils/isStatsDemandesVisible";

const findStatsDemandesInDB = async ({
  status,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  motif,
  cfd,
  codeNiveauDiplome,
  dispositif,
  filiere,
  coloration,
  amiCMA,
  secteur,
  cfdFamille,
  codeDepartement,
  codeAcademie,
  commune,
  uai,
  compensation,
  user,
  offset = 0,
  limit = 20,
  orderBy = { order: "desc", column: "createdAt" },
}: {
  status?: "draft" | "submitted";
  codeRegion?: string[];
  rentreeScolaire?: string;
  typeDemande?: string[];
  motif?: string[];
  cfd?: string[];
  codeNiveauDiplome?: string[];
  dispositif?: string[];
  filiere?: string[];
  coloration?: string;
  amiCMA?: string;
  secteur?: string;
  cfdFamille?: string[];
  codeDepartement?: string[];
  codeAcademie?: string[];
  commune?: string[];
  uai?: string[];
  compensation?: string;
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
  offset?: number;
  limit?: number;
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const demandes = await kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.dispositifId")
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("familleMetier", "familleMetier.cfdSpecialite", "demande.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "demande.cfd")
        .onRef("indicateurRegionSortie.codeRegion", "=", "demande.codeRegion")
        .onRef(
          "indicateurRegionSortie.dispositifId",
          "=",
          "demande.dispositifId"
        )
        .on("indicateurRegionSortie.millesimeSortie", "=", "2020_2021")
    )
    .selectAll("demande")
    .select((eb) => [
      "niveauDiplome.libelleNiveauDiplome as niveauDiplome",
      "dataFormation.libelle as libelleDiplome",
      "dataFormation.libelleFiliere as libelleFiliere",
      "dataEtablissement.libelle as libelleEtablissement",
      "dataEtablissement.commune as commune",
      "dispositif.libelleDispositif as libelleDispositif",
      "region.libelleRegion as libelleRegion",
      "departement.libelle as libelleDepartement",
      "departement.codeDepartement as codeDepartement",
      countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissage(eb).as(
        "differenceCapaciteApprentissage"
      ),
      sql<string>`count(*) over()`.as("count"),
      jsonObjectFrom(
        eb
          .selectFrom(["demande as demandeCompensee"])
          .whereRef("demandeCompensee.cfd", "=", "demande.compensationCfd")
          .whereRef("demandeCompensee.uai", "=", "demande.compensationUai")
          .whereRef(
            "demandeCompensee.dispositifId",
            "=",
            "demande.compensationDispositifId"
          )
          .select(["demandeCompensee.id", "demandeCompensee.typeDemande"])
          .limit(1)
      ).as("demandeCompensee"),
      selectTauxInsertion6mois("indicateurRegionSortie").as("insertion"),
      selectTauxPoursuite("indicateurRegionSortie").as("poursuite"),
      selectTauxDevenirFavorable("indicateurRegionSortie").as(
        "devenirFavorable"
      ),
      selectTauxPressionParFormationEtParRegionDemande({
        eb,
        rentreeScolaire: "2022",
      }).as("pression"),
      nbEtablissementFormationRegion({ eb, rentreeScolaire: "2022" }).as(
        "nbEtablissement"
      ),
    ])
    .$call((eb) => {
      if (status && status != undefined)
        return eb.where("demande.status", "=", status);
      return eb;
    })
    .$call((eb) => {
      if (codeRegion) return eb.where("demande.codeRegion", "in", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "in",
          codeDepartement
        );
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie)
        return eb.where("dataEtablissement.codeAcademie", "in", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (commune) return eb.where("dataEtablissement.commune", "in", commune);
      return eb;
    })
    .$call((eb) => {
      if (uai) return eb.where("dataEtablissement.uai", "in", uai);
      return eb;
    })
    .$call((eb) => {
      if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
        return eb.where(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      return eb;
    })
    .$call((eb) => {
      if (motif)
        return eb.where((eb) =>
          eb.or(
            motif.map(
              (m) => sql<boolean>`${m} = any(${eb.ref("demande.motif")})`
            )
          )
        );
      return eb;
    })
    .$call((eb) => {
      if (typeDemande)
        return eb.where("demande.typeDemande", "in", typeDemande);
      return eb;
    })
    .$call((eb) => {
      if (cfd) return eb.where("demande.cfd", "in", cfd);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome)
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      return eb;
    })
    .$call((eb) => {
      if (dispositif) return eb.where("demande.dispositifId", "in", dispositif);
      return eb;
    })
    .$call((eb) => {
      if (filiere)
        return eb.where("dataFormation.libelleFiliere", "in", filiere);
      return eb;
    })
    .$call((eb) => {
      if (cfdFamille)
        return eb.where("familleMetier.cfdFamille", "in", cfdFamille);
      return eb;
    })
    .$call((eb) => {
      if (coloration)
        return eb.where(
          "demande.coloration",
          "=",
          coloration === "true" ? sql<true>`true` : sql<false>`false`
        );
      return eb;
    })
    .$call((eb) => {
      if (amiCMA)
        return eb.where(
          "demande.amiCma",
          "=",
          amiCMA === "true" ? sql<true>`true` : sql<false>`false`
        );
      return eb;
    })
    .$call((eb) => {
      if (compensation)
        return eb.where("demande.typeDemande", "in", [
          "ouverture_compensation",
          "augmentation_compensation",
        ]);
      return eb;
    })
    .$call((eb) => {
      if (secteur) return eb.where("dataEtablissement.secteur", "=", secteur);
      return eb;
    })
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .where(isStatsDemandeVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        createdAt: demande.createdAt?.toISOString(),
        updatedAt: demande.updatedAt?.toISOString(),
        idCompensation: demande.demandeCompensee?.id,
        typeCompensation: demande.demandeCompensee?.typeDemande ?? undefined,
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};

const findFiltersInDb = async ({
  status,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  motif,
  cfd,
  codeNiveauDiplome,
  dispositif,
  filiere,
  coloration,
  amiCMA,
  secteur,
  cfdFamille,
  codeDepartement,
  codeAcademie,
  commune,
  uai,
  compensation,
  user,
}: {
  status?: "draft" | "submitted";
  codeRegion?: string[];
  rentreeScolaire?: string;
  typeDemande?: string[];
  motif?: string[];
  cfd?: string[];
  codeNiveauDiplome?: string[];
  dispositif?: string[];
  filiere?: string[];
  coloration?: string;
  amiCMA?: string;
  secteur?: string;
  cfdFamille?: string[];
  codeDepartement?: string[];
  codeAcademie?: string[];
  commune?: string[];
  uai?: string[];
  compensation?: string;
  user: Pick<RequestUser, "id" | "role" | "codeRegion">;
}) => {
  const inCodeRegion = (eb: ExpressionBuilder<DB, "region">) => {
    if (!codeRegion) return sql<boolean>`${isRegionVisible({ user })}`;
    return eb.and([
      eb("region.codeRegion", "in", codeRegion),
      sql<boolean>`${isRegionVisible({ user })}`,
    ]);
  };

  const inCodeDepartement = (eb: ExpressionBuilder<DB, "departement">) => {
    if (!codeDepartement) return sql<true>`true`;
    return eb("departement.codeDepartement", "in", codeDepartement);
  };

  const inCodeAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
    if (!codeAcademie) return sql<true>`true`;
    return eb("academie.codeAcademie", "in", codeAcademie);
  };

  const inCommune = (eb: ExpressionBuilder<DB, "dataEtablissement">) => {
    if (!commune) return sql<true>`true`;
    return eb("dataEtablissement.commune", "in", commune);
  };

  const inEtablissement = (eb: ExpressionBuilder<DB, "dataEtablissement">) => {
    if (!uai) return sql<true>`true`;
    return eb("dataEtablissement.uai", "in", uai);
  };

  const inRentreeScolaire = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!rentreeScolaire || Number.isNaN(rentreeScolaire))
      return sql<true>`true`;
    return eb("demande.rentreeScolaire", "=", parseInt(rentreeScolaire));
  };

  const inCfd = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!cfd) return sql<true>`true`;
    return eb("dataFormation.cfd", "in", cfd);
  };

  const inCodeNiveauDiplome = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!codeNiveauDiplome) return sql<true>`true`;
    return eb("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
  };

  const inFiliere = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!filiere) return sql<true>`true`;
    return eb("dataFormation.libelleFiliere", "in", filiere);
  };

  const inFamilleMetier = (eb: ExpressionBuilder<DB, "familleMetier">) => {
    if (!cfdFamille) return sql<true>`true`;
    return eb("familleMetier.cfdFamille", "in", cfdFamille);
  };

  const inCodeDispositif = (eb: ExpressionBuilder<DB, "dispositif">) => {
    if (!dispositif) return sql<true>`true`;
    return eb("dispositif.codeDispositif", "in", dispositif);
  };

  const inTypeDemande = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!typeDemande) return sql<true>`true`;
    return eb("demande.typeDemande", "in", typeDemande);
  };

  const inMotifDemande = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!motif) return sql<true>`true`;
    return eb.or(
      motif.map((m) => sql<boolean>`${m} = any(${eb.ref("demande.motif")})`)
    );
  };

  const inColoration = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!coloration) return sql<true>`true`;
    return eb(
      "demande.coloration",
      "=",
      coloration === "true" ? sql<true>`true` : sql<false>`false`
    );
  };

  const inAmiCMA = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!amiCMA) return sql<true>`true`;
    return eb(
      "demande.amiCma",
      "=",
      amiCMA === "true" ? sql<true>`true` : sql<false>`false`
    );
  };

  const inSecteur = (eb: ExpressionBuilder<DB, "dataEtablissement">) => {
    if (!secteur) return sql<true>`true`;
    return eb("dataEtablissement.secteur", "=", secteur);
  };

  const inCompensation = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!compensation) return sql<true>`true`;
    return eb("demande.typeDemande", "in", [
      "ouverture_compensation",
      "augmentation_compensation",
    ]);
  };

  const inStatus = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!status || status == undefined) return sql<true>`true`;
    return eb("demande.status", "=", status);
  };

  const geoFiltersBase = kdb
    .selectFrom("region")
    .leftJoin("departement", "departement.codeRegion", "region.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "region.codeRegion")
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const regionsFilters = geoFiltersBase
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .where("region.codeRegion", "not in", ["99", "00"])
    .where(isRegionVisible({ user }))
    .execute();

  const departementsFilters = geoFiltersBase
    .select([
      "departement.libelle as label",
      "departement.codeDepartement as value",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where("departement.libelle", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb)]),
        codeDepartement
          ? eb("departement.codeDepartement", "in", codeDepartement)
          : sql`false`,
      ]);
    })
    .execute();

  const academiesFilters = geoFiltersBase
    .select(["academie.libelle as label", "academie.codeAcademie as value"])
    .where("academie.codeAcademie", "is not", null)
    .where("academie.codeAcademie", "not in", [
      "00",
      "54",
      "61",
      "62",
      "63",
      "67",
      "66",
      "91",
      "99",
    ])
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb)]),
        codeAcademie
          ? eb("academie.codeAcademie", "in", codeAcademie)
          : sql`false`,
      ]);
    })
    .execute();

  const filtersBase = kdb
    .selectFrom("demande")
    .leftJoin("region", "region.codeRegion", "demande.codeRegion")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.dispositifId")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("familleMetier", "familleMetier.cfdSpecialite", "demande.cfd")
    .leftJoin("departement", "departement.codeRegion", "demande.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "demande.codeRegion")
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const communesFilters = filtersBase
    .select([
      "dataEtablissement.commune as label",
      "dataEtablissement.commune as value",
    ])
    .where("dataEtablissement.commune", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inMotifDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        commune ? eb("dataEtablissement.commune", "in", commune) : sql`false`,
      ]);
    })
    .execute();

  const etablissementsFilters = filtersBase
    .select([
      "dataEtablissement.libelle as label",
      "dataEtablissement.uai as value",
    ])
    .where("dataEtablissement.libelle", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inMotifDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        uai ? eb("dataEtablissement.uai", "in", uai) : sql`false`,
      ]);
    })
    .execute();

  const rentreesScolairesFilters = filtersBase
    .select([
      "demande.rentreeScolaire as label",
      "demande.rentreeScolaire as value",
    ])
    .where("demande.rentreeScolaire", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inTypeDemande(eb),
          inMotifDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        rentreeScolaire && !Number.isNaN(rentreeScolaire)
          ? eb("demande.rentreeScolaire", "=", parseInt(rentreeScolaire))
          : sql`false`,
      ]);
    })
    .execute();

  const typesDemandeFilters = filtersBase
    .select(["demande.typeDemande as label", "demande.typeDemande as value"])
    .where("demande.typeDemande", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inMotifDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        typeDemande ? eb("demande.typeDemande", "in", typeDemande) : sql`false`,
      ]);
    })
    .execute();

  const motifsDemandeFilters = filtersBase
    .select([
      sql`unnest(demande.motif)`.as("label"),
      sql`unnest(demande.motif)`.as("value"),
    ])
    .where("demande.motif", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        motif
          ? eb.or(
              motif.map(
                (m) => sql<boolean>`${m} = any(${eb.ref("demande.motif")})`
              )
            )
          : sql`false`,
      ]);
    })
    .execute();

  const dispositifsFilters = await filtersBase
    .select([
      "dispositif.libelleDispositif as label",
      "dispositif.codeDispositif as value",
    ])
    .where("dispositif.codeDispositif", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inMotifDemande(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        dispositif
          ? eb("dispositif.codeDispositif", "in", dispositif)
          : sql`false`,
      ]);
    })
    .execute();

  const diplomesFilters = await filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inMotifDemande(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        codeNiveauDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome)
          : sql`false`,
      ]);
    })
    .execute();

  const formationsFilters = await filtersBase
    .select((eb) => [
      sql`CONCAT(${eb.ref("dataFormation.libelle")}, ' (', ${eb.ref(
        "dataFormation.libelle"
      )}, ')')
          `.as("label"),
      "dataFormation.cfd as value",
    ])
    .where("dataFormation.cfd", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inMotifDemande(eb),
          inTypeDemande(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        cfd ? eb("dataFormation.cfd", "in", cfd) : sql`false`,
      ]);
    })
    .execute();

  const famillesFilters = await filtersBase
    .select([
      "familleMetier.libelleOfficielFamille as label",
      "familleMetier.cfdFamille as value",
    ])
    .where("familleMetier.cfdFamille", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inMotifDemande(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFiliere(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        cfdFamille
          ? eb("familleMetier.cfdFamille", "in", cfdFamille)
          : sql`false`,
      ]);
    })
    .execute();

  const filieresFilters = await filtersBase
    .select([
      "dataFormation.libelleFiliere as label",
      "dataFormation.libelleFiliere as value",
    ])
    .where("dataFormation.libelleFiliere", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inCommune(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inMotifDemande(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeDispositif(eb),
          inFamilleMetier(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatus(eb),
        ]),
        filiere
          ? eb("dataFormation.libelleFiliere", "in", filiere)
          : sql`false`,
      ]);
    })
    .execute();

  const filters = {
    regions: (await regionsFilters).map(cleanNull),
    rentreesScolaires: (await rentreesScolairesFilters).map(cleanNull),
    typesDemande: (await typesDemandeFilters).map(cleanNull),
    motifs: (await motifsDemandeFilters).map(cleanNull),
    dispositifs: (await dispositifsFilters).map(cleanNull),
    diplomes: (await diplomesFilters).map(cleanNull),
    formations: (await formationsFilters).map(cleanNull),
    familles: (await famillesFilters).map(cleanNull),
    filieres: (await filieresFilters).map(cleanNull),
    departements: (await departementsFilters).map(cleanNull),
    academies: (await academiesFilters).map(cleanNull),
    communes: (await communesFilters).map(cleanNull),
    etablissements: (await etablissementsFilters).map(cleanNull),
    status: [
      {
        label: "Brouillon",
        value: "draft",
      },
      {
        label: "Validée",
        value: "submitted",
      },
    ],
    secteurs: [
      {
        label: "Public",
        value: "PU",
      },
      {
        label: "Privé",
        value: "PR",
      },
    ],
    amiCMAs: [
      {
        label: "Oui",
        value: "true",
      },
      {
        label: "Non",
        value: "false",
      },
    ],
    colorations: [
      {
        label: "Oui",
        value: "true",
      },
      {
        label: "Non",
        value: "false",
      },
    ],
    compensations: [
      {
        label: "Oui",
        value: "true",
      },
      {
        label: "Non",
        value: "false",
      },
    ],
    statuts: [
      {
        label: "Projet",
        value: "draft",
      },
      {
        label: "Validée",
        value: "submitted",
      },
    ],
  };

  return {
    ...filters,
  };
};

export const dependencies = {
  findStatsDemandesInDB,
  findFiltersInDb,
};
