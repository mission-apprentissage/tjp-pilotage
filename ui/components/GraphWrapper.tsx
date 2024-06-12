"use client";
import { Box, chakra, Flex, Tooltip } from "@chakra-ui/react";

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
          <Tooltip label={`${Math.round(value * 100000) / 1000} %`}>
            <Box textAlign="center" w="10">
              {(value * 100).toFixed()}%
            </Box>
          </Tooltip>
        </>
      ) : (
        "-"
      )}
    </Flex>
  )
);
