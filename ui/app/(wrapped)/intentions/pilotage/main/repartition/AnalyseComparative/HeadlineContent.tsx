import { chakra, Th, Tooltip, Tr } from "@chakra-ui/react";

import type {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { OrderIcon } from "@/components/OrderIcon";

export const HeadlineContent = chakra(
  ({
    order,
    filters,
    handleOrder,
    isZoneGeographiqueSelected,
  }: {
    order: Partial<OrderRepartitionPilotageIntentions>;
    handleOrder: (column: OrderRepartitionPilotageIntentions["orderBy"]) => void;
    filters?: Partial<FiltersStatsPilotageIntentions>;
    isZoneGeographiqueSelected: boolean;
  }) => {
    return (
      <Tr>
        <Th cursor={"pointer"} onClick={() => handleOrder("libelle")}>
          <OrderIcon {...order} column="libelle" />
          {isZoneGeographiqueSelected ? filters?.scope : "Domaine"}
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesTransformees")}>
          <OrderIcon {...order} column="placesTransformees" />
          Places transformées
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("effectif")}>
          <OrderIcon {...order} column="effectif" />
          Effectif en entrée
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("tauxTransformation")}>
          <>
            <OrderIcon {...order} column="tauxTransformation" />
            <Tooltip label={"Places transformées / effectif"}>Taux de transformation</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesOuvertes")}>
          <>
            <OrderIcon {...order} column="placesOuvertes" />
            <Tooltip label={"Places ouvertes"}>dont ouvertures</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesFermees")}>
          <>
            <OrderIcon {...order} column="placesFermees" />
            <Tooltip label={"Places fermées"}>dont fermetures</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("placesColorees")}>
          <>
            <OrderIcon {...order} column="placesColorees" />
            <Tooltip label={"Places colorées"}>dont colorations</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("solde")}>
          <>
            <OrderIcon {...order} column="solde" />
            <Tooltip label={"Places ouvertes - places fermées"}>solde</Tooltip>
          </>
        </Th>
        <Th isNumeric cursor={"pointer"} onClick={() => handleOrder("ratioFermeture")}>
          <>
            <OrderIcon {...order} column="ratioFermeture" />
            <Tooltip label={"Places fermées / places transformées"}>ratio fermetures</Tooltip>
          </>
        </Th>
      </Tr>
    );
  }
);
