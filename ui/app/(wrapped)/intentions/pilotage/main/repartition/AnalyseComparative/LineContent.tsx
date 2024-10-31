import { chakra, Td, Text, Tooltip } from "@chakra-ui/react";

const SEUIL_RATIO_FERMETURE: number = 0.33;

import { Fragment } from "react";

import { RepartitionPilotageIntentionsLine } from "@/app/(wrapped)/intentions/pilotage/types";
import { formatLargeNumber, formatPercentage } from "@/utils/formatUtils";
export const LineContent = chakra(
  ({
    tdBgColor,
    tdColor,
    getTauxTransfoBgColor,
    line,
  }: {
    tdBgColor?: string;
    tdColor?: string;
    getTauxTransfoBgColor: (
      tauxTransformation: number | undefined
    ) => string | undefined;
    line: RepartitionPilotageIntentionsLine;
  }) => {
    return (
      <>
        <Td bgColor={tdBgColor} color={tdColor} border={"none !important"}>
          <Tooltip label={line.libelle}>
            <Text
              textOverflow={"ellipsis"}
              overflow={"hidden"}
              whiteSpace={"break-spaces"}
              noOfLines={2}
            >
              {line.libelle}
            </Text>
          </Tooltip>
        </Td>
        <Td
          bgColor={tdBgColor}
          border={"none !important"}
          color={tdColor}
          isNumeric
        >
          {formatLargeNumber(line.placesTransformees)}
        </Td>
        <Td
          bgColor={tdBgColor}
          border={"none !important"}
          color={tdColor}
          isNumeric
        >
          {formatLargeNumber(line.effectif, "\u00A0", "-")}
        </Td>
        <Td
          bgColor={getTauxTransfoBgColor(line.tauxTransformation)}
          border={"none !important"}
          color={"black"}
          isNumeric
        >
          <Tooltip label={`${line.placesTransformees} / ${line.effectif}`}>
            {formatPercentage(line.tauxTransformation, 1, "-")}
          </Tooltip>
        </Td>
        <Td
          width={24}
          maxWidth={24}
          bgColor={tdBgColor}
          border={"none !important"}
          color={tdColor}
          isNumeric
        >
          {formatLargeNumber(line.placesOuvertes)}
        </Td>
        <Td
          width={24}
          maxWidth={24}
          bgColor={tdBgColor}
          border={"none !important"}
          color={tdColor}
          isNumeric
        >
          {formatLargeNumber(line.placesFermees)}
        </Td>
        <Td
          width={24}
          maxWidth={24}
          bgColor={tdBgColor}
          border={"none !important"}
          color={tdColor}
          isNumeric
        >
          {formatLargeNumber(line.placesColorees)}
        </Td>
        <Td
          width={24}
          maxWidth={24}
          bgColor={tdBgColor}
          border={"none !important"}
          color={tdColor}
          isNumeric
        >
          <Tooltip label={`${line.placesOuvertes} - ${line.placesFermees}`}>
            {line.solde.toString()}
          </Tooltip>
        </Td>
        <Td
          color={tdColor}
          bgColor={
            line.ratioFermeture !== undefined &&
            line.ratioFermeture < SEUIL_RATIO_FERMETURE
              ? "pilotage.red"
              : "inherit"
          }
          border={"none !important"}
          isNumeric
        >
          <Tooltip label={`${line.placesFermees} / ${line.placesTransformees}`}>
            {formatPercentage(line.ratioFermeture, 1, "-")}
          </Tooltip>
        </Td>
      </>
    );
  }
);
