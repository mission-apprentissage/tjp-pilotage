"use client";
import { Box, chakra, Flex } from "@chakra-ui/react";

import { Graph } from "./Graph";

export const GraphWrapper = chakra(
  ({
    value,
    continuum,
    className,
  }: {
    value?: number;
    continuum?: { cfd: string; libelleFormation?: string };
    className?: string;
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
            value={value * 100}
            display="inline-block"
            mr="1"
          />
          <Box textAlign="center" w="10">
            {(value * 100).toFixed()}%
          </Box>
        </>
      ) : (
        "-"
      )}
    </Flex>
  )
);
