"use client";
import { Box, chakra } from "@chakra-ui/react";

import { Graph } from "./Graph";

export const GraphWrapper = chakra(
  ({
    value,
    continuum,
    className,
    objective = 100,
  }: {
    value?: number;
    continuum?: { cfd: string; libelle?: string };
    className?: string;
    objective?: number;
  }) => (
    <Box w="160px" className={className} display="flex" alignItems="center">
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
