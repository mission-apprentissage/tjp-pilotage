import { Th, Tooltip, Tr } from "@chakra-ui/react";

import type {
  FiltersPilotage,
  OrderPilotage,
} from "@/app/(wrapped)/demandes/pilotage/types";
import { OrderIcon } from "@/components/OrderIcon";

export const HeadlineContent =
  ({
    order,
    filters,
    handleOrder,
    isZoneGeographiqueSelected,
  }: {
    order: Partial<OrderPilotage>;
    handleOrder: (column: OrderPilotage["orderBy"]) => void;
    filters?: Partial<FiltersPilotage>;
    isZoneGeographiqueSelected: boolean;
  }) => {
    return (
      <Tr>
        <Th cursor={"pointer"} onClick={() => handleOrder("libelle")} fontSize={12}>
          <OrderIcon {...order} column="libelle" />
          {isZoneGeographiqueSelected ? filters?.scope : "Domaine"}
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesTransformees")} fontSize={12}>
          <OrderIcon {...order} column="placesTransformees" />
          Places transformées
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("effectif")} fontSize={12}>
          <OrderIcon {...order} column="effectif" />
          Effectif en entrée
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("tauxTransformation")} fontSize={12}>
          <>
            <OrderIcon {...order} column="tauxTransformation" />
            <Tooltip label={"Places transformées / effectif"}>Taux de transformation</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesOuvertes")} fontSize={12}>
          <>
            <OrderIcon {...order} column="placesOuvertes" />
            <Tooltip label={"Places ouvertes"}>dont ouvertures</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesFermees")} fontSize={12}>
          <>
            <OrderIcon {...order} column="placesFermees" />
            <Tooltip label={"Places fermées"}>dont fermetures</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesColorees")} fontSize={12}>
          <>
            <OrderIcon {...order} column="placesColorees" />
            <Tooltip label={"Places colorées"}>dont colorations</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("solde")} fontSize={12}>
          <>
            <OrderIcon {...order} column="solde" />
            <Tooltip label={"Places ouvertes - places fermées"}>solde</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("ratioFermeture")} fontSize={12}>
          <>
            <OrderIcon {...order} column="ratioFermeture" />
            <Tooltip label={"Places fermées / places transformées"}>ratio fermetures</Tooltip>
          </>
        </Th>
      </Tr>
    );
  };
