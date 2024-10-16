import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import {
  isInPerimetreIJAcademie,
  isInPerimetreIJDepartement,
  isInPerimetreIJRegion,
} from "../../../utils/isInPerimetreIJ";
import { notHistoriqueUnlessCoExistant } from "../../../utils/notHistorique";
import { Filters } from "../getFormationEtablissements.usecase";

export const getFiltersQuery = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  commune,
  secteur,
  cfdFamille,
  codeNiveauDiplome,
  codeDispositif,
  cfd,
  uai,
  codeNsf,
  rentreeScolaire = [CURRENT_RENTREE],
}: Partial<Filters>) => {
  const base = kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "formationView.cfd")
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "in", rentreeScolaire)
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.codeDispositif"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "formationView.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.uai",
      "formationEtablissement.uai"
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

  const inCfdFamille = (eb: ExpressionBuilder<DB, "familleMetier">) => {
    if (!cfdFamille) return sql<true>`true`;
    return eb.or([
      eb("familleMetier.cfd", "in", cfdFamille),
      eb("familleMetier.cfdFamille", "in", cfdFamille),
    ]);
  };

  const inCfd = (eb: ExpressionBuilder<DB, "formationView">) => {
    if (!cfd) return sql<true>`true`;
    return eb("formationView.cfd", "in", cfd);
  };

  const inCodeDiplome = (eb: ExpressionBuilder<DB, "formationView">) => {
    if (!codeNiveauDiplome) return sql<true>`true`;
    return eb("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
  };

  const inCodeDispositif = (
    eb: ExpressionBuilder<DB, "formationEtablissement">
  ) => {
    if (!codeDispositif) return sql<true>`true`;
    return eb("formationEtablissement.codeDispositif", "in", codeDispositif);
  };

  const inDomaine = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!codeNsf) return sql<true>`true`;
    return eb("dataFormation.codeNsf", "in", codeNsf);
  };

  const inSecteur = (eb: ExpressionBuilder<DB, "etablissement">) => {
    if (!secteur) return sql<true>`true`;
    return eb("etablissement.secteur", "in", secteur);
  };

  const regionFilters = await base
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .where(isInPerimetreIJRegion)
    .execute();

  const academieFilters = await base
    .select([
      "academie.libelleAcademie as label",
      "academie.codeAcademie as value",
    ])
    .where("academie.codeAcademie", "is not", null)
    .where(isInPerimetreIJAcademie)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb)]),
        codeAcademie
          ? eb("academie.codeAcademie", "in", codeAcademie)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const departementFilters = await base
    .select([
      "departement.libelleDepartement as label",
      "departement.codeDepartement as value",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(isInPerimetreIJDepartement)
    .where((eb) => {
      return eb.or([
        eb.and([inCodeRegion(eb), inCodeAcademie(eb)]),
        codeDepartement
          ? eb("departement.codeDepartement", "in", codeDepartement)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const communeFilters = await base
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

  const etablissementFilters = await base
    .select([
      "etablissement.libelleEtablissement as label",
      "etablissement.uai as value",
    ])
    .where("etablissement.uai", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCodeRegion(eb),
          inCodeAcademie(eb),
          inCodeDepartement(eb),
          inCommune(eb),
          inSecteur(eb),
        ]),
        uai ? eb("etablissement.uai", "in", uai) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const diplomeFilters = await base
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCfdFamille(eb), inCfd(eb), inCodeDispositif(eb)]),
        codeNiveauDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const dispositifFilters = await base
    .select([
      "dispositif.libelleDispositif as label",
      "dispositif.codeDispositif as value",
    ])
    .where("dispositif.codeDispositif", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([inCfdFamille(eb), inCfd(eb), inCodeDiplome(eb)]),
        codeNiveauDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  const familleFilters = await base
    .select([
      "familleMetier.libelleFamille as label",
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

  const formationFilters = await base
    .select([
      sql`CONCAT("formationView"."libelleFormation", ' (', "niveauDiplome"."libelleNiveauDiplome", ')')
      `.as("label"),
      "formationView.cfd as value",
    ])
    .where("formationView.cfd", "is not", null)
    .where((eb) => {
      return eb.or([
        eb.and([
          inCfdFamille(eb),
          inCodeDiplome(eb),
          inCodeDispositif(eb),
          inDomaine(eb),
        ]),
        cfd ? eb("formationView.cfd", "in", cfd) : sql<boolean>`false`,
      ]);
    })
    .execute();

  const libelleNsfFilters = await base
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select(["nsf.libelleNsf as label", "formationView.codeNsf as value"])
    .where("nsf.libelleNsf", "is not", null)
    .execute();

  const secteurFilters = await base
    .select((eb) => [
      "etablissement.secteur as value",
      eb
        .case()
        .when("etablissement.secteur", "=", "PU")
        .then("Public")
        .when("etablissement.secteur", "=", "PR")
        .then("Privé")
        .end()
        .as("label"),
    ])
    .execute();

  return {
    regions: regionFilters.map(cleanNull),
    departements: departementFilters.map(cleanNull),
    academies: academieFilters.map(cleanNull),
    communes: communeFilters.map(cleanNull),
    etablissements: etablissementFilters.map(cleanNull),
    diplomes: diplomeFilters.map(cleanNull),
    dispositifs: dispositifFilters.map(cleanNull),
    familles: familleFilters.map(cleanNull),
    formations: formationFilters.map(cleanNull),
    libellesNsf: libelleNsfFilters.map(cleanNull),
    secteurs: secteurFilters.map(cleanNull),
  };
};
