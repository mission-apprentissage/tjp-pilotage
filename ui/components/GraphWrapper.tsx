"use client";
import { Box, chakra, Flex, Tooltip } from "@chakra-ui/react";

import { displayPercentage } from "../utils/displayPercent";
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
    <Flex
      w="160px"
      className={className}
      display="flex"
      alignItems="center"
      justifyContent={"center"}
    >
      {value !== undefined && !Number.isNaN(value) ? (
        <>
          <Graph
            flex={1}
            continuum={continuum}
            outlined={outlined}
            value={value * 100}
            display="inline-block"
            mr="1"
          />
          <Tooltip label={displayPercentage(value)}>
            <Box textAlign="center" w="10">
              {displayPercentage(value, 0)}
            </Box>
          </Tooltip>
        </>
      ) : (
        "-"
      )}
    </Flex>
  )
);
