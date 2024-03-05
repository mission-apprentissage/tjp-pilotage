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
      outlined = false,
    }: {
      value: number;
      className?: string;
      continuum?: { cfd: string; libelleFormation?: string };
      outlined?: boolean;
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
              {continuum?.libelleFormation}
            </Text>
          </>
        }
      >
        <Box
          className={className}
          bg={"grey.900"}
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
              bg={
                value >= 0
                  ? outlined
                    ? "white"
                    : "bluefrance.525"
                  : outlined
                  ? "white"
                  : "redmarianne.625"
              }
              borderColor={
                value >= 0
                  ? outlined
                    ? "bluefrance.525"
                    : "transparent"
                  : outlined
                  ? "redmarianne.625"
                  : "transparent"
              }
              borderWidth={outlined ? 2 : 0}
              width={`${Math.abs(value)}%`}
            />
          )}
        </Box>
      </Tooltip>
    )
  )
);
