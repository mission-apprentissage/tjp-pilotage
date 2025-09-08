import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { isInPerimetreIJAcademie } from "@/modules/data/utils/isInPerimetreIJ";
import type { Filters } from "@/modules/demandes/usecases/getDemandes/getDemandes.usecase";
import { getCampagnes } from '@/modules/utils/getCurrentCampagne';
import { isDemandeNotDeleted, isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { cleanNull } from "@/utils/noNull";

export const getFiltersQuery = async ({
  user,
  codeAcademie,
  codeDepartement,
  commune,
  uai,
  codeNiveauDiplome,
  codeNsf,
  cfd,
  nomCmq,
  filiereCmq
}: Filters) => {

  const inCodeRegion = (eb: ExpressionBuilder<DB, "region">) => {
    if (!user.codeRegion) return sql<true>`true`;
    return eb("region.codeRegion", "in", [user.codeRegion]);
  };

  const inCodeAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
    if (!codeAcademie) return sql<true>`true`;
    return eb("academie.codeAcademie", "in", codeAcademie);
  };

  const inCodeDepartement = (eb: ExpressionBuilder<DB, "departement">) => {
    if (!codeDepartement) return sql<true>`true`;
    return eb("departement.codeDepartement", "in", codeDepartement);
  };

  const inCommune = (eb: ExpressionBuilder<DB, "dataEtablissement">) => {
    if (!commune) return sql<true>`true`;
    return eb("dataEtablissement.commune", "in", commune);
  };

  const inUai = (eb: ExpressionBuilder<DB, "dataEtablissement">) => {
    if (!uai) return sql<true>`true`;
    return eb("dataEtablissement.uai", "in", uai);
  };

  const inCodeNiveauDiplome = (eb: ExpressionBuilder<DB, "niveauDiplome">) => {
    if (!codeNiveauDiplome) return sql<true>`true`;
    return eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome);
  };

  const inCodeNsf = (eb: ExpressionBuilder<DB, "nsf">) => {
    if (!codeNsf) return sql<true>`true`;
    return eb("nsf.codeNsf", "in", codeNsf);
  };

  const inCfd = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!cfd) return sql<true>`true`;
    return eb("dataFormation.cfd", "in", cfd);
  };

  const inNomCmq = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!nomCmq) return sql<true>`true`;
    return eb("demande.nomCmq", "in", nomCmq);
  };

  const inFiliereCmq = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!filiereCmq) return sql<true>`true`;
    return eb("demande.filiereCmq", "in", filiereCmq);
  };

  const geoFiltersBase = getKbdClient()
    .selectFrom("region")
    .leftJoin("departement", "departement.codeRegion", "region.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "region.codeRegion")
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const academiesFilters = await geoFiltersBase
    .select(["academie.libelleAcademie as label", "academie.codeAcademie as value"])
    .where("academie.codeAcademie", "is not", null)
    .where(isInPerimetreIJAcademie)
    .where((eb) => {
      return eb.or([
        inCodeRegion(eb),
      ]);
    })
    .execute();

  const departementsFilters = await geoFiltersBase
    .select(["departement.libelleDepartement as label", "departement.codeDepartement as value"])
    .where("departement.codeDepartement", "is not", null)
    .where(isInPerimetreIJAcademie)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
      ]);
    })
    .execute();

  const filtersBase = getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .leftJoin("region", "region.codeRegion", "demande.codeRegion")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
    .leftJoin("departement", "departement.codeRegion", "demande.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "demande.codeRegion")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .where(isDemandeNotDeleted)
    .where(isDemandeSelectable({ user }))
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const communeFilters = await filtersBase
    .select(["dataEtablissement.commune as label", "dataEtablissement.commune as value"])
    .where("dataEtablissement.commune", "is not", null)
    .where(isInPerimetreIJAcademie)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
      ]);
    })
    .execute();

  const etablissementFilters = await filtersBase
    .select(["dataEtablissement.libelleEtablissement as label", "dataEtablissement.uai as value"])
    .where("dataEtablissement.uai", "is not", null)
    .where(isInPerimetreIJAcademie)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
        inCommune(eb),
      ]);
    })
    .execute();

  const diplomesFilters = await filtersBase
    .select(["niveauDiplome.libelleNiveauDiplome as label", "niveauDiplome.codeNiveauDiplome as value"])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
        inCommune(eb),
        inUai(eb),
        inCodeNsf(eb),
        inCfd(eb),
        inNomCmq(eb),
        inFiliereCmq(eb)
      ]);
    })
    .execute();

  const domainesFilters = await filtersBase
    .select(["nsf.libelleNsf as label", "nsf.codeNsf as value"])
    .where("nsf.codeNsf", "is not", null)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
        inCommune(eb),
        inUai(eb),
        inCodeNiveauDiplome(eb),
        inCfd(eb),
        inNomCmq(eb),
        inFiliereCmq(eb)
      ]);
    })
    .execute();

  const formationsFilters = await filtersBase
    .select(["dataFormation.libelleFormation as label", "dataFormation.cfd as value"])
    .where("dataFormation.cfd", "is not", null)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
        inCommune(eb),
        inUai(eb),
        inCodeNiveauDiplome(eb),
        inCodeNsf(eb),
        inNomCmq(eb),
        inFiliereCmq(eb)
      ]);
    })
    .execute();

  const nomsCmqFilters = await filtersBase
    .select(["demande.nomCmq as label", "demande.nomCmq as value"])
    .where("demande.nomCmq", "is not", null)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
        inCommune(eb),
        inUai(eb),
        inCodeNiveauDiplome(eb),
        inCodeNsf(eb),
        inCfd(eb),
        inFiliereCmq(eb)
      ]);
    })
    .execute();

  const filieresCmqFilters = await filtersBase
    .select(["demande.filiereCmq as label", "demande.filiereCmq as value"])
    .where("demande.filiereCmq", "is not", null)
    .where((eb) => {
      return eb.and([
        inCodeRegion(eb),
        inCodeAcademie(eb),
        inCodeDepartement(eb),
        inCommune(eb),
        inUai(eb),
        inCodeNiveauDiplome(eb),
        inCodeNsf(eb),
        inCfd(eb),
        inNomCmq(eb),
      ]);
    })
    .execute();


  const campagnesFilters = await getCampagnes(user);

  return {
    academies: academiesFilters.map(cleanNull),
    departements: departementsFilters.map(cleanNull),
    communes: communeFilters.map(cleanNull),
    etablissements: etablissementFilters.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
    campagnes: campagnesFilters.map(cleanNull),
    formations: formationsFilters.map(cleanNull),
    domaines: domainesFilters.map(cleanNull),
    filieresCmq: filieresCmqFilters.map(cleanNull),
    nomsCmq: nomsCmqFilters.map(cleanNull),
  };
};
