"use client";
import { Box, chakra } from "@chakra-ui/react";

import { Graph } from "./Graph";

export const GraphWrapper = chakra(
  ({
    value,
    continuum,
    className,
  }: {
    value?: number;
    continuum?: { cfd: string; libelle?: string };
    className?: string;
  }) => (
    <Box w="180px" className={className} display="flex" alignItems="center">
      {value !== undefined && !Number.isNaN(value) ? (
        <>
          <Graph
            flex={1}
            continuum={continuum}
            value={value}
            display="inline-block"
            mr="1"
          />
          <Box textAlign="center" w="10">
            {value.toFixed()}%
          </Box>
        </>
      ) : (
        "-"
      )}
    </Box>
  )
);
