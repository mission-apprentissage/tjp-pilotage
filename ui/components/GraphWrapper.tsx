"use client";
import { Box, chakra, Flex, Tooltip } from "@chakra-ui/react";

import { formatPercentage } from "@/utils/formatUtils";

import { Graph } from "./Graph";

export const GraphWrapper = chakra(
  ({
    value,
    continuum,
    className,
    outlined = false,
  }: {
    value?: number;
    continuum?: { cfd: string; libelleFormation?: string };
    className?: string;
    outlined?: boolean;
  }) => (
    <Flex w="160px" display="flex" alignItems="center" justifyContent={"center"} mx={"auto"} className={className} >
      {value !== undefined && !Number.isNaN(value) ? (
        <>
          <Graph flex={1} continuum={continuum} outlined={outlined} value={value * 100} display="inline-block" mr="1" />
          <Tooltip label={formatPercentage(value, 2)}>
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
