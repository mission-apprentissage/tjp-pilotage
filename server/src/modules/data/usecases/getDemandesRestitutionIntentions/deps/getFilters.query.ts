import { ExpressionBuilder, sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { VoieEnum } from "shared/enum/voieEnum";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { isRegionVisible } from "../../../../utils/isIntentionVisible";
import { Filters } from "../getDemandesRestitutionIntentions.usecase";

export const getFilters = async ({
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
  campagne,
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
    .where(isRegionVisible({ user }))
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

  const communesFilters = await filtersBase
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

  const typesDemandeFilters = await filtersBase
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

  const motifsDemandeFilters = await filtersBase
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
    regions: regionsFilters.map(cleanNull),
    rentreesScolaires: rentreesScolairesFilters.map(cleanNull),
    typesDemande: typesDemandeFilters.map(cleanNull),
    motifs: motifsDemandeFilters.map(cleanNull),
    dispositifs: dispositifsFilters.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
    formations: formationsFilters.map(cleanNull),
    familles: famillesFilters.map(cleanNull),
    CPCs: CPCFilters.map(cleanNull),
    libellesNsf: libellesNsf.map(cleanNull),
    departements: departementsFilters.map(cleanNull),
    academies: academiesFilters.map(cleanNull),
    communes: communesFilters.map(cleanNull),
    etablissements: etablissementsFilters.map(cleanNull),
    campagnes: campagnesFilters.map(cleanNull),
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
        value: DemandeStatutEnum.draft,
      },
      {
        label: "Validée",
        value: DemandeStatutEnum.submitted,
      },
      {
        label: "Refusée",
        value: DemandeStatutEnum.refused,
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
