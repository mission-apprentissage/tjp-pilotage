"use client";
import { Box, chakra, Text, Tooltip } from "@chakra-ui/react";
import { memo } from "react";

import { ContinuumIcon } from "./icons/ContinuumIcon";

export const Graph = memo(
  chakra(
    ({
      value = 50,
      className,
      continuum,
    }: {
      value: number;
      className?: string;
      continuum?: { cfd: string; libelle?: string };
    }) => (
      <Tooltip
        isDisabled={!continuum}
        maxWidth={250}
        p="3"
        label={
          <>
            <ContinuumIcon fontSize={16} mr="1" />
            Données manquantes sur cette formation, le taux affiché est celui de
            la formation historique :<br />
            <Text mt="1" fontStyle="italic">
              {continuum?.libelle}
            </Text>
          </>
        }
      >
        <Box
          className={className}
          bg="grey.900"
          height="10px"
          position="relative"
          borderRadius="4"
          overflow="hidden"
        >
          {continuum && (
            <Box
              height="100%"
              borderRightRadius="4"
              bgImage="linear-gradient(117deg, #dddddd 25%, #b119ad 25%, #b119ad 50%, #dddddd 50%, #dddddd 75%, #b119ad 75%, #b119ad 100%)"
              bgSize="4.00px 7.85px"
              width={`${Math.abs(value)}%`}
            />
          )}
          {!continuum && (
            <Box
              height="100%"
              borderRightRadius="4"
              bg={value >= 0 ? "bluefrance.525" : "redmarianne.625"}
              width={`${Math.abs(value)}%`}
            />
          )}
        </Box>
      </Tooltip>
    )
  )
);
