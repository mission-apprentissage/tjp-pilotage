import { Tooltip, Tr } from "@chakra-ui/react";

import type {
  FiltersPilotageIntentions,
  OrderPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { SortableTh } from "@/components/SortableTh";

export const HeadlineContent =
  ({
    order,
    filters,
    handleOrder,
    isZoneGeographiqueSelected,
  }: {
    order: Partial<OrderPilotageIntentions>;
    handleOrder: (column: OrderPilotageIntentions["orderBy"]) => void;
    filters?: Partial<FiltersPilotageIntentions>;
    isZoneGeographiqueSelected: boolean;
  }) => {
    return (
      <Tr>
        <SortableTh handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="libelle">
          {isZoneGeographiqueSelected ? filters?.scope : "Domaine"}
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="placesTransformees">
          Places transformées
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="effectif">
          Effectif en entrée
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="tauxTransformation">
          <Tooltip label={"Places transformées / effectif"}>Taux de transformation</Tooltip>
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="placesOuvertes">
          <Tooltip label={"Places ouvertes"}>dont ouvertures</Tooltip>
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="placesFermees">
          <Tooltip label={"Places fermées"}>dont fermetures</Tooltip>
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="placesColorees">
          <Tooltip label={"Places colorées"}>dont colorations</Tooltip>
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="solde">
          <Tooltip label={"Places ouvertes - places fermées"}>solde</Tooltip>
        </SortableTh>
        <SortableTh isNumeric handleOrder={(colonne) => handleOrder(colonne as typeof order.orderBy)} order={order} colonne="ratioFermeture">
          <Tooltip label={"Places fermées / places transformées"}>ratio fermetures</Tooltip>
        </SortableTh>
      </Tr>
    );
  };
