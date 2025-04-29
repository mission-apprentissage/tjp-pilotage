import { chain, filter, get, keys, sumBy, union } from "lodash-es";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type {OrderType} from 'shared/enum/orderEnum';
import type { StatsSchema } from "shared/routes/schemas/get.pilotage.schema";
import type { z } from "zod";

import type { Repartition } from "./getPilotage.usecase";

/**
 *
 * Fonction qui permet de calculer la somme des données aggrégées données de demande et d'effectif
 *
 * @param statsRepartition
 * @returns
 */
const calculateTotal = (statsRepartition: z.infer<typeof StatsSchema>[]): z.infer<typeof StatsSchema>[] => {
  const total: z.infer<typeof StatsSchema> = {
    libelle: "Total",
    code: "total",
    effectif: 0,
    placesOuvertes: 0,
    placesFermees: 0,
    placesNonColoreesTransformees: 0,
    placesColoreesOuvertes: 0,
    placesColoreesFermees: 0,
    placesColorees: 0,
    placesTransformees: 0,
    placesOuvertesTransformationEcologique: 0,
    placesOuvertesQ1: 0,
    placesFermeesQ4: 0,
    placesColoreesQ4: 0,
    solde: 0,
    countDemande: 0,
    tauxTransformation: undefined,
    ratioOuverture: undefined,
    ratioFermeture: undefined,
  };

  Object.values(statsRepartition).forEach((stats) => {
    total.effectif += stats.effectif;
    total.placesOuvertes += stats.placesOuvertes;
    total.placesFermees += stats.placesFermees;
    total.placesNonColoreesTransformees += stats.placesNonColoreesTransformees;
    total.placesColoreesOuvertes += stats.placesColoreesOuvertes;
    total.placesColoreesFermees += stats.placesColoreesFermees;
    total.placesColorees += stats.placesColorees;
    total.placesTransformees += stats.placesTransformees;
    total.placesOuvertesTransformationEcologique += stats.placesOuvertesTransformationEcologique;
    total.placesOuvertesQ1 += stats.placesOuvertesQ1;
    total.placesFermeesQ4 += stats.placesFermeesQ4;
    total.placesColoreesQ4 += stats.placesColoreesQ4;
    total.countDemande += stats.countDemande;
    total.solde += stats.solde;
  });

  if (total.effectif !== 0) {
    total.tauxTransformation = total.placesTransformees / total.effectif;
  }
  if (total.placesTransformees !== 0) {
    total.ratioOuverture = total.placesOuvertes / total.placesTransformees;
    total.ratioFermeture = total.placesFermees / total.placesTransformees;
  }

  return [...statsRepartition, total];
};

const groupByResult = ({ numerateur, denominateur, groupBy }: Repartition) => {
  // Récupérer tous les codes possibles (y compris ceux qui n'ont pas d'effectif ou de demande)
  const allKeys = union(
    keys(chain(numerateur).groupBy(groupBy.code).value()),
    keys(chain(denominateur).groupBy(groupBy.code).value())
  );

  return chain(allKeys)
    .map((code) => {
      // Chercher les effectifs associées
      const effectifGrouped = filter(denominateur, {
        [groupBy.code]: code,
      });
      // Chercher les demandes associées
      const demandeGrouped = filter(numerateur, {
        [groupBy.code]: code,
      });

      // Somme des effectifs
      const totalEffectifs = sumBy(effectifGrouped, "effectif");

      // Somme des places
      const sommePlacesOuvertes = sumBy(demandeGrouped, "placesOuvertes");
      const sommePlacesFermees = sumBy(demandeGrouped, "placesFermees");
      const sommePlacesNonColoreesTransformees = sumBy(demandeGrouped, "placesNonColoreesTransformees");
      const sommePlacesColorees = sumBy(demandeGrouped, "placesColorees");
      const sommePlacesColoreesOuvertes = sumBy(demandeGrouped, "placesColoreesOuvertes");
      const sommePlacesColoreesFermees = sumBy(demandeGrouped, "placesColoreesFermees");
      const sommePlacesFermeesQ4 = sumBy(demandeGrouped, "placesFermeesQ4");
      const sommePlacesOuvertesQ1 = sumBy(demandeGrouped, "placesOuvertesQ1");
      const sommePlacesColoreesQ4 = sumBy(demandeGrouped, "placesColoreesQ4");
      const sommePlacesOuvertesTransformationEcologique = sumBy(
        demandeGrouped,
        "placesOuvertesTransformationEcologique"
      );
      const sommePlacesTransformees = sumBy(demandeGrouped, "placesTransformees");
      const sommeCountDemande = sumBy(demandeGrouped, "countDemande");
      const sommeSolde = sommePlacesOuvertes - sommePlacesFermees;
      const libelle = get(effectifGrouped[0], groupBy.libelle) ?? get(demandeGrouped[0], groupBy.libelle);

      return {
        code: code,
        libelle: libelle ?? code,
        effectif: totalEffectifs,
        placesOuvertes: sommePlacesOuvertes,
        placesFermees: sommePlacesFermees,
        placesNonColoreesTransformees: sommePlacesNonColoreesTransformees,
        placesColoreesOuvertes: sommePlacesColoreesOuvertes,
        placesColoreesFermees: sommePlacesColoreesFermees,
        placesColorees: sommePlacesColorees,
        placesTransformees: sommePlacesTransformees,
        placesOuvertesTransformationEcologique: sommePlacesOuvertesTransformationEcologique,
        placesFermeesQ4: sommePlacesFermeesQ4,
        placesOuvertesQ1: sommePlacesOuvertesQ1,
        placesColoreesQ4: sommePlacesColoreesQ4,
        countDemande: sommeCountDemande,
        solde: sommeSolde,
      };
    })
    .value();
};

export const formatResult = (repartition: Repartition, order: OrderType = "desc", orderBy?: string) => {
  return chain(calculateTotal(groupByResult(repartition)))
    .map((item) => ({
      ...item,
      libelle: item.libelle ?? item.code,
      ratioFermeture:
        item.placesFermees && item.placesOuvertes
          ? item.placesFermees / (item.placesFermees + item.placesOuvertes)
          : undefined,
      ratioOuverture:
        item.placesFermees && item.placesOuvertes
          ? item.placesOuvertes / (item.placesFermees + item.placesOuvertes)
          : undefined,
      tauxTransformation: item.effectif ? item.placesTransformees / item.effectif : undefined,
    }))
    .orderBy((item) => {
      const value = orderBy ? item[orderBy as keyof typeof item] : item.libelle;

      return value ?? 0;
    }, order)
    .keyBy("libelle")
    .value();
};

/**
 *
 * Fonction qui permet de calculer la somme des données aggrégées données de demande sur un effectif commun
 *
 * @param statsRepartition
 * @returns
 */
const calculateTotalUngrouped = (statsRepartition: z.infer<typeof StatsSchema>[]): z.infer<typeof StatsSchema>[] => {
  const total: z.infer<typeof StatsSchema> = {
    libelle: "Total",
    code: "total",
    effectif: 0,
    placesOuvertes: 0,
    placesFermees: 0,
    placesNonColoreesTransformees: 0,
    placesColoreesOuvertes: 0,
    placesColoreesFermees: 0,
    placesColorees: 0,
    placesTransformees: 0,
    placesOuvertesTransformationEcologique: 0,
    placesOuvertesQ1: 0,
    placesFermeesQ4: 0,
    placesColoreesQ4: 0,
    solde: 0,
    countDemande: 0,
    tauxTransformation: undefined,
    ratioOuverture: undefined,
    ratioFermeture: undefined,
  };

  Object.values(statsRepartition).forEach((stats) => {
    if(stats.code === DemandeStatutEnum["refusée"]) return;
    total.effectif = stats.effectif;
    total.placesOuvertes += stats.placesOuvertes;
    total.placesFermees += stats.placesFermees;
    total.placesNonColoreesTransformees += stats.placesNonColoreesTransformees;
    total.placesColoreesOuvertes += stats.placesColoreesOuvertes;
    total.placesColoreesFermees += stats.placesColoreesFermees;
    total.placesColorees += stats.placesColorees;
    total.placesTransformees += stats.placesTransformees;
    total.placesOuvertesTransformationEcologique += stats.placesOuvertesTransformationEcologique;
    total.placesOuvertesQ1 += stats.placesOuvertesQ1;
    total.placesFermeesQ4 += stats.placesFermeesQ4;
    total.placesColoreesQ4 += stats.placesColoreesQ4;
    total.countDemande += stats.countDemande;
    total.solde += stats.solde;
  });

  if (total.effectif !== 0) {
    total.tauxTransformation = total.placesTransformees / total.effectif;
  }
  if (total.placesTransformees !== 0) {
    total.ratioOuverture = total.placesOuvertes / total.placesTransformees;
    total.ratioFermeture = total.placesFermees / total.placesTransformees;
  }

  return [...statsRepartition, total];
};

const groupByResultUngrouped = ({ numerateur, denominateur, groupBy }: Repartition) => {
  // Récupérer tous les codes possibles (y compris ceux qui n'ont pas d'effectif ou de demande)
  const allKeys = keys(chain(numerateur).groupBy(groupBy.code).value());

  return chain(allKeys)
    .map((code) => {
      // Chercher les effectifs associées
      const effectifs = denominateur;
      // Chercher les demandes associées
      const demandeGrouped = filter(numerateur, {
        [groupBy.code]: code,
      });

      // Somme des effectifs
      const totalEffectifs = sumBy(effectifs, "effectif");

      // Somme des places
      const sommePlacesOuvertes = sumBy(demandeGrouped, "placesOuvertes");
      const sommePlacesFermees = sumBy(demandeGrouped, "placesFermees");
      const sommePlacesNonColoreesTransformees = sumBy(demandeGrouped, "placesNonColoreesTransformees");
      const sommePlacesColorees = sumBy(demandeGrouped, "placesColorees");
      const sommePlacesColoreesOuvertes = sumBy(demandeGrouped, "placesColoreesOuvertes");
      const sommePlacesColoreesFermees = sumBy(demandeGrouped, "placesColoreesFermees");
      const sommePlacesFermeesQ4 = sumBy(demandeGrouped, "placesFermeesQ4");
      const sommePlacesOuvertesQ1 = sumBy(demandeGrouped, "placesOuvertesQ1");
      const sommePlacesColoreesQ4 = sumBy(demandeGrouped, "placesColoreesQ4");
      const sommePlacesOuvertesTransformationEcologique = sumBy(
        demandeGrouped,
        "placesOuvertesTransformationEcologique"
      );
      const sommePlacesTransformees = sumBy(demandeGrouped, "placesTransformees");
      const sommeCountDemande = sumBy(demandeGrouped, "countDemande");
      const sommeSolde = sommePlacesOuvertes - sommePlacesFermees;
      const libelle = get(demandeGrouped[0], groupBy.libelle);

      return {
        code: code,
        libelle: libelle ?? code,
        effectif: totalEffectifs,
        placesOuvertes: sommePlacesOuvertes,
        placesFermees: sommePlacesFermees,
        placesNonColoreesTransformees: sommePlacesNonColoreesTransformees,
        placesColoreesOuvertes: sommePlacesColoreesOuvertes,
        placesColoreesFermees: sommePlacesColoreesFermees,
        placesColorees: sommePlacesColorees,
        placesTransformees: sommePlacesTransformees,
        placesOuvertesTransformationEcologique: sommePlacesOuvertesTransformationEcologique,
        placesFermeesQ4: sommePlacesFermeesQ4,
        placesOuvertesQ1: sommePlacesOuvertesQ1,
        placesColoreesQ4: sommePlacesColoreesQ4,
        countDemande: sommeCountDemande,
        solde: sommeSolde,
      };
    })
    .value();
};

export const formatResultUngrouped = (repartition: Repartition, order: OrderType = "desc", orderBy?: string) => {
  return chain(calculateTotalUngrouped(groupByResultUngrouped(repartition)))
    .map((item) => ({
      ...item,
      libelle: item.libelle ?? item.code,
      ratioFermeture:
        item.placesFermees && item.placesOuvertes
          ? item.placesFermees / (item.placesFermees + item.placesOuvertes)
          : undefined,
      ratioOuverture:
        item.placesFermees && item.placesOuvertes
          ? item.placesOuvertes / (item.placesFermees + item.placesOuvertes)
          : undefined,
      tauxTransformation: item.effectif ? item.placesTransformees / item.effectif : undefined,
    }))
    .orderBy((item) => {
      const value = orderBy ? item[orderBy as keyof typeof item] : item.libelle;

      return value ?? 0;
    }, order)
    .keyBy("libelle")
    .value();
};
