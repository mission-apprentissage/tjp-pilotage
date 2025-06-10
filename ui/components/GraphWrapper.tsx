"use client";
import { Box, chakra, Flex, Tooltip } from "@chakra-ui/react";

import { formatMillesime } from "@/utils/formatLibelle";
import { formatPercentage } from "@/utils/formatUtils";

import { Graph } from "./Graph";

const getTooltipLabel = (value: number, millesime?: string, rentreeScolaire?: string) => {
  const formattedMillesime = millesime ? ` (millésimes ${formatMillesime(millesime)})` : "";
  const formattedRentreeScolaire = rentreeScolaire ? ` (rentrée scolaire ${rentreeScolaire})` : "";
  return `${formatPercentage(value, 2)} ${formattedMillesime}${formattedRentreeScolaire}`;
};

export const GraphWrapper = chakra(
  ({
    value,
    millesime,
    rentreeScolaire,
    continuum,
    className,
    outlined = false,
  }: {
    value?: number;
    millesime?: string;
    rentreeScolaire?: string;
    continuum?: { cfd: string; libelleFormation?: string };
    className?: string;
    outlined?: boolean;
  }) => (
    <Flex w="160px" className={className} display="flex" alignItems="center" justifyContent={"center"}>
      {value !== undefined && !Number.isNaN(value) ? (
        <>
          <Graph flex={1} continuum={continuum} outlined={outlined} value={value * 100} display="inline-block" mr="1" />
          <Tooltip label={getTooltipLabel(value, millesime, rentreeScolaire)}>
            <Box textAlign="center" w="10">
              {formatPercentage(value, 0)}
            </Box>
          </Tooltip>
        </>
      ) : (
        "-"
      )}
    </Flex>
  )
);
