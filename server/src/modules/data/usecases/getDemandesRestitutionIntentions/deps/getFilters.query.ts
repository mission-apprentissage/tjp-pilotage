import { ExpressionBuilder, sql } from "kysely";
import _ from "lodash";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { VoieEnum } from "shared/enum/voieEnum";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { isDemandeNotDeleted } from "../../../../utils/isDemandeSelectable";
import {
  isRestitutionIntentionRegionVisible,
  isRestitutionIntentionVisible,
} from "../../../../utils/isRestitutionIntentionVisible";
import { Filters } from "../getDemandesRestitutionIntentions.usecase";

export const getFilters = async ({
  statut,
  codeRegion,
  rentreeScolaire,
  typeDemande,
  cfd,
  codeNiveauDiplome,
  codeNsf,
  amiCMA,
  secteur,
  codeDepartement,
  codeAcademie,
  uai,
  user,
  campagne,
}: Filters) => {
  const inCodeRegion = (eb: ExpressionBuilder<DB, "region">) => {
    if (!codeRegion)
      return sql<boolean>`${isRestitutionIntentionRegionVisible({ user })}`;
    return eb.and([
      eb("region.codeRegion", "in", codeRegion),
      sql<boolean>`${isRestitutionIntentionRegionVisible({ user })}`,
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

  const inCodeNsf = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!codeNsf) return sql<true>`true`;
    return eb("dataFormation.codeNsf", "in", codeNsf);
  };

  const inTypeDemande = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!typeDemande) return sql<true>`true`;
    return eb("demande.typeDemande", "in", typeDemande);
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

  const inStatut = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!statut) return sql<true>`true`;
    return eb("demande.statut", "in", statut);
  };

  const inCampagne = (eb: ExpressionBuilder<DB, "campagne">) => {
    if (!campagne) return sql<true>`true`;
    return eb("campagne.annee", "=", campagne);
  };

  const geoFiltersBase = kdb
    .selectFrom("region")
    .leftJoin("departement", "departement.codeRegion", "region.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "region.codeRegion")
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const regionsFilters = await geoFiltersBase
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .where("region.codeRegion", "not in", ["99", "00"])
    .where(isRestitutionIntentionRegionVisible({ user }))
    .execute();

  const departementsFilters = await geoFiltersBase
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

  const academiesFilters = await geoFiltersBase
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

  const campagnesFilters = await kdb
    .selectFrom("campagne")
    .select(["campagne.annee as label", "campagne.annee as value", "statut"])
    .distinct()
    .$castTo<{ label: string; value: string; statut: string }>()
    .orderBy("label", "desc")
    .where("campagne.annee", "is not", null)
    .execute();

  const filtersBase = kdb
    .selectFrom("latestDemandeIntentionView as demande")
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
    .where(isDemandeNotDeleted)
    .where(isRestitutionIntentionVisible({ user }))
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const etablissementsFilters = await filtersBase
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
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeNsf(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        uai ? eb("dataEtablissement.uai", "in", uai) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const rentreesScolairesFilters = await filtersBase
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
          inEtablissement(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeNsf(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        rentreeScolaire && !Number.isNaN(rentreeScolaire)
          ? eb("demande.rentreeScolaire", "=", parseInt(rentreeScolaire))
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const typesDemandeFilters = await filtersBase
    .select(["demande.typeDemande as label", "demande.typeDemande as value"])
    .where("demande.typeDemande", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeDepartement(eb),
          inCodeAcademie(eb),
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inCodeNsf(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        typeDemande
          ? eb("demande.typeDemande", "in", typeDemande)
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
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNsf(eb),
          inAmiCMA(eb),
          inSecteur(eb),
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
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inCodeNiveauDiplome(eb),
          inCodeNsf(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        cfd ? eb("dataFormation.cfd", "in", cfd) : sql<boolean>`false`,
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
          inEtablissement(eb),
          inRentreeScolaire(eb),
          inTypeDemande(eb),
          inCfd(eb),
          inCodeNiveauDiplome(eb),
          inAmiCMA(eb),
          inSecteur(eb),
          inStatut(eb),
          inCampagne(eb),
        ]),
        codeNsf
          ? eb("dataFormation.codeNsf", "in", codeNsf)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const statutsFilters = _.values(DemandeStatutEnum).filter(
    (statut) =>
      statut !== DemandeStatutEnum["brouillon"] &&
      statut !== DemandeStatutEnum["supprimée"]
  );

  const filters = {
    regions: regionsFilters.map(cleanNull),
    rentreesScolaires: rentreesScolairesFilters.map(cleanNull),
    typesDemande: typesDemandeFilters.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
    formations: formationsFilters.map(cleanNull),
    libellesNsf: libellesNsf.map(cleanNull),
    departements: departementsFilters.map(cleanNull),
    academies: academiesFilters.map(cleanNull),
    etablissements: etablissementsFilters.map(cleanNull),
    campagnes: campagnesFilters.map(cleanNull),
    statuts: statutsFilters.map((value) =>
      cleanNull({
        value,
        label: _.capitalize(value),
      })
    ),
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
        label: "Toutes demandes (avec et sans places colorées)",
        value: "all",
      },
      {
        label:
          "Uniquement les ouvertures/fermetures (sans les colorations de places existantes)",
        value: "without",
      },
      {
        label:
          "Uniquement les demandes avec places colorées (ouvertures/fermetures/existantes)",
        value: "with",
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
    voies: [
      {
        label: "Scolaire",
        value: VoieEnum.scolaire,
      },
      {
        label: "Apprentissage",
        value: VoieEnum.apprentissage,
      },
    ],
  };

  return {
    ...filters,
  };
};
