import { expressionBuilder } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getCampagneFromRentreeScolaire } from "shared/time/campagne";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { DB } from "../../../db/db";
import { isInDenominateurTauxTransfo } from "../../utils/isInDenominateurTauxTransfo";
import { isInPerimetreIJDataEtablissement } from "./isInPerimetreIJ";

export const genericOnConstatRentree = ({
  codeNiveauDiplome,
  CPC,
  codeNsf,
  rentree = CURRENT_RENTREE,
  codeRegion,
  codeAcademie,
  codeDepartement,
  campagne,
  secteur,
}: {
  codeNiveauDiplome?: string[];
  CPC?: string[];
  codeNsf?: string[];
  rentree?: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  campagne?: string;
  secteur?: string[];
}) =>
  expressionBuilder<DB, keyof DB>()
    .selectFrom("campagne")
    .leftJoin("constatRentree", (join) => join.onTrue())
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.uai",
      "constatRentree.uai"
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("dataFormation.cfd")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeDispositif"),
            "=",
            eb.ref("constatRentree.codeDispositif")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(
              getMillesimeFromCampagne(
                campagne ?? getCampagneFromRentreeScolaire(rentree)
              )
            )
          ),
        ])
      )
    )
    .where(isInDenominateurTauxTransfo)
    .where(isInPerimetreIJDataEtablissement)
    .$call((eb) => {
      if (campagne) return eb.where("campagne.annee", "=", campagne);
      return eb;
    })
    .where("constatRentree.rentreeScolaire", "=", rentree)
    .$call((eb) => {
      if (codeRegion)
        return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie)
        return eb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "=",
          codeDepartement
        );
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
      if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
      return eb;
    })
    .$call((q) => {
      if (!secteur || secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "in", secteur);
    });
