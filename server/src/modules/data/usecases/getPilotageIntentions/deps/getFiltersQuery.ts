import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import {capitalize,values} from 'lodash-es';
import { CURRENT_RENTREE } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";
import {
  isInPerimetreIJAcademie,
  isInPerimetreIJDepartement,
  isInPerimetreIJRegion,
} from "@/modules/data/utils/isInPerimetreIJ";
import { isDemandeNotDeletedOrRefused } from "@/modules/utils/isDemandeSelectable";
import { cleanNull } from "@/utils/noNull";

export const getFiltersQuery = async ({filters}: {filters: Filters}) => {
  const inStatut = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!filters.statut) return sql<true>`true`;
    return eb("demande.statut", "in", filters.statut);
  };

  const inRentreeScolaire = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!filters.rentreeScolaire) return sql<true>`true`;
    return eb(
      "demande.rentreeScolaire",
      "in",
      filters.rentreeScolaire.map((rentree) => parseInt(rentree))
    );
  };

  const inCodeNiveauDiplome = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!filters.codeNiveauDiplome) return sql<true>`true`;
    return eb("dataFormation.codeNiveauDiplome", "in", filters.codeNiveauDiplome);
  };

  const inCPC = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!filters.CPC) return sql<true>`true`;
    return eb("dataFormation.cpc", "in", filters.CPC);
  };

  const inNsf = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!filters.codeNsf) return sql<true>`true`;
    return eb("dataFormation.codeNsf", "in", filters.codeNsf);
  };

  const inCampagne = (eb: ExpressionBuilder<DB, "campagne">) => {
    if (!filters.campagne) return sql<true>`true`;
    return eb("campagne.annee", "=", filters.campagne);
  };

  const base = getKbdClient()
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .innerJoin("academie", "academie.codeAcademie", "dataEtablissement.codeAcademie")
    .innerJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .where(isDemandeNotDeletedOrRefused)
    .$call((q) => {
      if (!filters.coloration || filters.coloration === "false")
        return q.where((w) =>
          w.or([w("demande.coloration", "=", false), w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"])])
        );
      return q;
    })
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const campagnesFilters = await getKbdClient()
    .selectFrom("campagne")
    .select(["campagne.annee as label", "campagne.annee as value"])
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc")
    .where("campagne.annee", "is not", null)
    .execute();

  const rentreesScolairesFilters = await base
    .select(["demande.rentreeScolaire as value", "demande.rentreeScolaire as label"])
    .where("demande.rentreeScolaire", "is not", null)
    .execute();

  const regionsFilters = await getKbdClient()
    .selectFrom("region")
    .select((eb) => [eb.ref("region.codeRegion").as("value"), eb.ref("region.libelleRegion").as("label")])
    .leftJoin("departement", "departement.codeRegion", "region.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "region.codeRegion")
    .where("region.codeRegion", "is not", null)
    .where(isInPerimetreIJRegion)
    .distinct()
    .orderBy("label", "asc")
    .execute();

  const academiesFilters = await base
    .select(["academie.codeAcademie as value", "academie.libelleAcademie as label"])
    .select((eb) => [eb.ref("academie.codeAcademie").as("value"), eb.ref("academie.libelleAcademie").as("label")])
    .where("academie.codeAcademie", "is not", null)
    .where(isInPerimetreIJAcademie)
    .$call((q) => {
      if (filters.codeRegion) {
        return q.where("region.codeRegion", "=", filters.codeRegion);
      }

      return q;
    })
    .orderBy("label", "asc")
    .execute();

  const departementsFilters = await base
    .select(["departement.codeDepartement as value", "departement.libelleDepartement as label"])
    .where("departement.codeDepartement", "is not", null)
    .where(isInPerimetreIJDepartement)
    .$call((q) => {
      if (filters.codeRegion) {
        return q.where("region.codeRegion", "=", filters.codeRegion);
      }

      if (filters.codeAcademie) {
        return q.where("academie.codeAcademie", "=", filters.codeAcademie);
      }

      return q;
    })
    .orderBy("label", "asc")
    .execute();

  const CPCFilters = await base
    .select(["dataFormation.cpc as label", "dataFormation.cpc as value"])
    .where("dataFormation.cpc", "is not", null)
    .where((eb) => eb.and([inStatut(eb), inRentreeScolaire(eb), inCodeNiveauDiplome(eb), inNsf(eb), inCampagne(eb)]))
    .execute();

  const nsfFilters = await base
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .select(["nsf.libelleNsf as label", "nsf.codeNsf as value"])
    .where("dataFormation.codeNsf", "is not", null)
    .where((eb) => eb.and([inStatut(eb), inRentreeScolaire(eb), inCodeNiveauDiplome(eb), inCPC(eb), inCampagne(eb)]))
    .execute();

  const niveauxDiplomesFilters = await base
    .select(["niveauDiplome.libelleNiveauDiplome as label", "niveauDiplome.codeNiveauDiplome as value"])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => eb.and([inStatut(eb), inRentreeScolaire(eb), inCPC(eb), inNsf(eb), inCampagne(eb)]))
    .union(
      getKbdClient()
        .selectFrom("constatRentree")
        .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
        .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
        .select(["niveauDiplome.libelleNiveauDiplome as label", "niveauDiplome.codeNiveauDiplome as value"])
        .distinct()
        .where("niveauDiplome.codeNiveauDiplome", "is not", null)
        .where("constatRentree.rentreeScolaire", "=", CURRENT_RENTREE)
        .where((eb) => eb.and([inCPC(eb), inNsf(eb)]))
        .$castTo<{ label: string; value: string }>()
    )
    .execute();

  const secteurFilters = await base
    .select((eb) => [
      "dataEtablissement.secteur as value",
      eb
        .case()
        .when("dataEtablissement.secteur", "=", "PU")
        .then("Public")
        .when("dataEtablissement.secteur", "=", "PR")
        .then("Privé")
        .end()
        .as("label"),
    ])
    .execute();

  const statutsFilters = values(DemandeStatutEnum).filter(
    (statut) => statut !== DemandeStatutEnum["brouillon"] && statut !== DemandeStatutEnum["supprimée"]
  );

  return {
    campagnes: campagnesFilters.map(cleanNull),
    rentreesScolaires: rentreesScolairesFilters.map(cleanNull),
    regions: regionsFilters.map(cleanNull),
    academies: academiesFilters.map(cleanNull),
    departements: departementsFilters.map(cleanNull),
    CPCs: CPCFilters.map(cleanNull),
    nsfs: nsfFilters.map(cleanNull),
    niveauxDiplome: niveauxDiplomesFilters.map(cleanNull),
    secteurs: secteurFilters.map(cleanNull),
    statuts: statutsFilters.map((value) =>
      cleanNull({
        value,
        label: capitalize(value),
      })
    ),
    colorations: [
      {
        label: "Avec",
        value: "true",
      },
      {
        label: "Sans",
        value: "false",
      },
    ]
  };
};
