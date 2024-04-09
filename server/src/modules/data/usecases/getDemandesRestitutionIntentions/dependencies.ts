import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE, MILLESIMES_IJ } from "shared";
import { z } from "zod";

import { DB, kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteScolaire,
} from "../../../utils/countCapacite";
import { isDemandeNotDeleted } from "../../../utils/isDemandeSelectable";
import {
  isIntentionVisible,
  isRegionVisible,
} from "../../../utils/isIntentionVisible";
import { isScolaireIndicateurRegionSortie } from "../../utils/isScolaire";
import { nbEtablissementFormationRegion } from "../../utils/nbEtablissementFormationRegion";
import { selectTauxDevenirFavorable } from "../../utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../utils/tauxPoursuite";
import { selectTauxPressionParFormationEtParRegionDemande } from "../../utils/tauxPression";
import { FiltersSchema } from "./getDemandesRestitutionIntentions.schema";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
}

const getDemandesRestitutionIntentionsQuery = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  motif,
  cfd,
  codeNiveauDiplome,
  dispositif,
  CPC,
  codeNsf,
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
  millesimeSortie = CURRENT_IJ_MILLESIME,
  voie,
  anneeCampagne,
  offset = 0,
  limit = 20,
  order = "desc",
  orderBy = "dateCreation",
}: Filters) => {
  const demandes = await kdb
    .selectFrom("latestDemandeView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (anneeCampagne) return eb.on("campagne.annee", "=", anneeCampagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "demande.codeDispositif"
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
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
          "demande.codeDispositif"
        )
        .on("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
        .on(isScolaireIndicateurRegionSortie)
    )
    .selectAll("demande")
    .select((eb) => [
      "niveauDiplome.codeNiveauDiplome as codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome as niveauDiplome",
      "dataFormation.libelleFormation",
      "nsf.libelleNsf as libelleNsf",
      "dataEtablissement.libelleEtablissement",
      "dataEtablissement.commune as commune",
      "dispositif.libelleDispositif",
      "region.libelleRegion as libelleRegion",
      "departement.libelleDepartement",
      "departement.codeDepartement as codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie as codeAcademie",
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
            "demandeCompensee.codeDispositif",
            "=",
            "demande.compensationCodeDispositif"
          )
          .select(["demandeCompensee.numero", "demandeCompensee.typeDemande"])
          .limit(1)
      ).as("demandeCompensee"),
      selectTauxInsertion6mois("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuite("indicateurRegionSortie").as("tauxPoursuite"),
      selectTauxDevenirFavorable("indicateurRegionSortie").as(
        "devenirFavorable"
      ),
      selectTauxPressionParFormationEtParRegionDemande({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("pression"),
      nbEtablissementFormationRegion({
        eb,
        rentreeScolaire: CURRENT_RENTREE,
      }).as("nbEtablissement"),
    ])
    .$call((eb) => {
      if (statut) return eb.where("demande.statut", "in", statut);
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
      if (dispositif)
        return eb.where("demande.codeDispositif", "in", dispositif);
      return eb;
    })
    .$call((eb) => {
      if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
      return eb;
    })
    .$call((eb) => {
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
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
    .$call((eb) => {
      if (voie === "apprentissage") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(${ebw.ref(
              "demande.capaciteApprentissage"
            )} - ${ebw.ref("demande.capaciteApprentissageActuelle")}) > 1`
        );
      }

      if (voie === "scolaire") {
        return eb.where(
          ({ eb: ebw }) =>
            sql<boolean>`abs(${ebw.ref("demande.capaciteScolaire")} - ${ebw.ref(
              "demande.capaciteScolaireActuelle"
            )}) > 1`
        );
      }

      return eb;
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(
        sql`${sql.ref(orderBy)}`,
        sql`${sql.raw(order)} NULLS LAST`
      );
    })
    .where(isDemandeNotDeleted)
    .where(isIntentionVisible({ user }))
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((demande) =>
      cleanNull({
        ...demande,
        dateCreation: demande.dateCreation?.toISOString(),
        dateModification: demande.dateModification?.toISOString(),
        numeroCompensation: demande.demandeCompensee?.numero,
        typeCompensation: demande.demandeCompensee?.typeDemande ?? undefined,
      })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};

const getFilters = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  motif,
  cfd,
  codeNiveauDiplome,
  dispositif,
  CPC,
  codeNsf,
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
  anneeCampagne,
}: Filters) => {
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

  const inCPC = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!CPC) return sql<true>`true`;
    return eb("dataFormation.cpc", "in", CPC);
  };

  const inCodeNsf = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!codeNsf) return sql<true>`true`;
    return eb("dataFormation.codeNsf", "in", codeNsf);
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

  const inStatut = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!statut) return sql<true>`true`;
    return eb("demande.statut", "in", statut);
  };

  const inCampagne = (eb: ExpressionBuilder<DB, "campagne">) => {
    if (!anneeCampagne) return sql<true>`true`;
    return eb("campagne.annee", "=", anneeCampagne);
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
      "departement.libelleDepartement as label",
      "departement.codeDepartement as value",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where("departement.libelleDepartement", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb), inCodeAcademie(eb)]),
        codeDepartement
          ? eb("departement.codeDepartement", "in", codeDepartement)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const academiesFilters = geoFiltersBase
    .select([
      "academie.libelleAcademie as label",
      "academie.codeAcademie as value",
    ])
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
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const campagnesFilters = kdb
    .selectFrom("campagne")
    .select(["campagne.annee as label", "campagne.annee as value"])
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc")
    .where("campagne.annee", "is not", null)
    .execute();

  const filtersBase = kdb
    .selectFrom("latestDemandeView as demande")
    .leftJoin("region", "region.codeRegion", "demande.codeRegion")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "demande.codeDispositif"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
    .leftJoin("departement", "departement.codeRegion", "demande.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "demande.codeRegion")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        commune
          ? eb("dataEtablissement.commune", "in", commune)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const etablissementsFilters = filtersBase
    .select([
      "dataEtablissement.libelleEtablissement as label",
      "dataEtablissement.uai as value",
    ])
    .where("dataEtablissement.libelleEtablissement", "is not", null)
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        uai ? eb("dataEtablissement.uai", "in", uai) : sql<boolean>`false`,
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        rentreeScolaire && !Number.isNaN(rentreeScolaire)
          ? eb("demande.rentreeScolaire", "=", parseInt(rentreeScolaire))
          : sql<boolean>`false`,
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        typeDemande
          ? eb("demande.typeDemande", "in", typeDemande)
          : sql<boolean>`false`,
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        motif
          ? eb.or(
              motif.map(
                (m) => sql<boolean>`${m} = any(${eb.ref("demande.motif")})`
              )
            )
          : sql<boolean>`false`,
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        dispositif
          ? eb("dispositif.codeDispositif", "in", dispositif)
          : sql<boolean>`false`,
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        codeNiveauDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const formationsFilters = await filtersBase
    .select((eb) => [
      sql`CONCAT(
      ${eb.ref("dataFormation.libelleFormation")},
      ' (',
      ${eb.ref("niveauDiplome.libelleNiveauDiplome")},
      ')'
    )`.as("label"),
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        cfd ? eb("dataFormation.cfd", "in", cfd) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const famillesFilters = await filtersBase
    .select([
      "familleMetier.libelleFamille as label",
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
          inCPC(eb),
          inCodeNsf(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        cfdFamille
          ? eb("familleMetier.cfdFamille", "in", cfdFamille)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const CPCFilters = await filtersBase
    .select(["dataFormation.cpc as label", "dataFormation.cpc as value"])
    .where("dataFormation.cpc", "is not", null)
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
          inCodeNsf(eb),
          inFamilleMetier(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        CPC ? eb("dataFormation.cpcSecteur", "in", CPC) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const libellesNsf = await filtersBase
    .leftJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .select(["nsf.libelleNsf as label", "nsf.codeNsf as value"])
    .where("nsf.libelleNsf", "is not", null)
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
          inCPC(eb),
          inFamilleMetier(eb),
          inColoration(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inCompensation(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        codeNsf
          ? eb("dataFormation.codeNsf", "in", codeNsf)
          : sql<boolean>`false`,
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
    CPCs: (await CPCFilters).map(cleanNull),
    libellesNsf: (await libellesNsf).map(cleanNull),
    departements: (await departementsFilters).map(cleanNull),
    academies: (await academiesFilters).map(cleanNull),
    communes: (await communesFilters).map(cleanNull),
    etablissements: (await etablissementsFilters).map(cleanNull),
    campagnes: (await campagnesFilters).map(cleanNull),
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
      {
        label: "Refusée",
        value: "refused",
      },
    ],
    voies: [
      {
        label: "Scolaire",
        value: "scolaire",
      },
      {
        label: "Apprentissage",
        value: "apprentissage",
      },
    ],
  };

  return {
    ...filters,
  };
};

export const dependencies = {
  getDemandesRestitutionIntentionsQuery,
  getFilters,
};