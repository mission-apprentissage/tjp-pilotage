import * as Boom from "@hapi/boom";
import * as _ from "lodash-es";
import type { VoieType } from "shared";
import { VoieEnum } from "shared";
import type { Etablissements, QueryFilters, TauxIJKey, TauxIJValue } from "shared/routes/schemas/get.formation.cfd.indicators.schema";

import { cleanNull } from "@/utils/noNull";

import {
  getEffectifs,
  getEtablissements,
  getFormation,
  getSoldePlacesTransformee,
  getTauxIJ,
  getTauxPressions,
} from "./dependencies";
import { getTauxRemplissages } from "./dependencies/getTauxRemplissage.dep";

function listUniqMillesimes(
  indicateurs: {
    millesimeSortie: string | null;
  }[]
) {
  return _.uniq(indicateurs.filter((i) => i.millesimeSortie).map((i) => i.millesimeSortie as string)).sort((a, z) =>
    a.localeCompare(z)
  );
}

const countEtablissementsByVoie =
  (etablissements: { rentreeScolaire: string, uai: string | null, voie: string | null }[]): Etablissements[] => {
    const result: Etablissements[] = [];
    const rentreeScolaires: Record<string, Record<"all" | "apprentissage" | "scolaire", Array<string>>> = {};

    etablissements.forEach(etab => {
      if (!etab.uai || !etab.voie || !etab.rentreeScolaire) return;

      if (!rentreeScolaires[etab.rentreeScolaire]) rentreeScolaires[etab.rentreeScolaire] = {
        all: [],
        apprentissage: [],
        scolaire: []
      };
      rentreeScolaires[etab.rentreeScolaire].all.push(etab.uai);

      if (etab.voie === VoieEnum.apprentissage) {
        if (!rentreeScolaires[etab.rentreeScolaire].apprentissage.find(e => e === etab.uai))
          rentreeScolaires[etab.rentreeScolaire].apprentissage.push(etab.uai);
      }

      if (etab.voie === VoieEnum.scolaire) {
        if (!rentreeScolaires[etab.rentreeScolaire].scolaire.find(e => e === etab.uai))
          rentreeScolaires[etab.rentreeScolaire].scolaire.push(etab.uai);
      }
    });

    Object.keys(rentreeScolaires).forEach(rentreeScolaire => {
      result.push({
        rentreeScolaire,
        nbEtablissements: {
          all: rentreeScolaires[rentreeScolaire].all.length,
          apprentissage: rentreeScolaires[rentreeScolaire].apprentissage.length,
          scolaire: rentreeScolaires[rentreeScolaire].scolaire.length,
        }
      });
    });

    return result;
  };

const formatIndicateursIJ = (indicateursIJ: Awaited<ReturnType<typeof getTauxIJ>>, voie?: VoieType) => {
  const millesimes = listUniqMillesimes(indicateursIJ);

  const tauxIJ: Record<TauxIJKey, TauxIJValue[]> = {
    tauxPoursuite: [],
    tauxInsertion: [],
    tauxDevenirFavorable: [],
  };

  millesimes.forEach((millesime) => {
    const indicateurs = indicateursIJ.filter((i) => i.millesimeSortie === millesime);
    const tauxApprentissage = indicateurs.find((i) => i.voie === "apprentissage");
    const tauxScolaire = indicateurs.find((i) => i.voie === "scolaire");

    // Création de l'object tauxIJ, pour chaque taux, création d'un tableau contenant les valeurs
    // pour chaque années
    ["tauxPoursuite", "tauxInsertion", "tauxDevenirFavorable"].forEach((taux) => {
      const key = taux as TauxIJKey;
      const tauxToInsert: TauxIJValue = {
        libelle: millesime.replace("_20", "+"),
      };

      if (voie) {
        if (voie === VoieEnum.scolaire) {
          tauxToInsert.scolaire = tauxScolaire?.[key];
        }
        if (voie === VoieEnum.apprentissage) {
          tauxToInsert.apprentissage = tauxApprentissage?.[key];
        }
      } else {
        tauxToInsert.scolaire = tauxScolaire?.[key];
        tauxToInsert.apprentissage = tauxApprentissage?.[key];
      }

      tauxIJ[key] = [
        ...tauxIJ[key],
        {
          ...tauxToInsert
        },
      ].map(cleanNull);
    });
  });

  return tauxIJ;
};

const formatSoldePlacesTransformees =
  (soldePlacesTransformees: Awaited<ReturnType<typeof getSoldePlacesTransformee>>, voie?: VoieType) => {
    if (voie) {
      if (voie === VoieEnum.scolaire) {
        return soldePlacesTransformees.map(solde => _.pick(solde, ["rentreeScolaire", "scolaire"]));
      }

      if (voie === VoieEnum.apprentissage) {
        return soldePlacesTransformees.map(solde => _.pick(solde, ["rentreeScolaire", "apprentissage"]));
      }
    }

    return soldePlacesTransformees;
  };

const getFormationIndicateursFactory =
  (
    deps = {
      getFormation,
      getTauxIJ,
      getEffectifs,
      getEtablissements,
      getTauxPressions,
      getTauxRemplissages,
      getSoldePlacesTransformee,
    }
  ) =>
    async (cfd: string, { codeAcademie, codeRegion, codeDepartement, voie }: QueryFilters) => {
      const [
        formation,
        tauxIJ,
        effectifs,
        etablissementsByVoies,
        tauxPressions,
        tauxRemplissages,
        soldePlacesTransformee
      ] =
      await Promise.all([
        deps.getFormation({ cfd }),
        deps.getTauxIJ({ cfd, codeRegion }),
        deps.getEffectifs({ cfd, codeRegion, codeDepartement, codeAcademie }),
        deps.getEtablissements({
          cfd,
          codeRegion,
          codeDepartement,
          codeAcademie,
        }),
        deps.getTauxPressions({
          cfd,
          codeRegion,
          codeAcademie,
          codeDepartement,
        }),
        deps.getTauxRemplissages({
          cfd,
          codeRegion,
          codeAcademie,
          codeDepartement,
        }),
        deps.getSoldePlacesTransformee({
          cfd,
          codeRegion,
          codeAcademie,
          codeDepartement,
        }),
      ]);

      const normalizedTauxIJ = formatIndicateursIJ(tauxIJ, voie);
      const normalizedSoldePlacesTransformées = formatSoldePlacesTransformees(soldePlacesTransformee, voie);
      const etablissements: Etablissements[] = countEtablissementsByVoie(etablissementsByVoies);



      if (!formation) {
        throw Boom.notFound(`La formation avec le cfd ${cfd} est inconnue`);
      }

      return {
        ...formation,
        tauxIJ: normalizedTauxIJ,
        effectifs,
        etablissements,
        tauxPressions,
        tauxRemplissages,
        soldePlacesTransformee: normalizedSoldePlacesTransformées,
      };
    };

export const getFormationIndicateursUseCase = getFormationIndicateursFactory();
