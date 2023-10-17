"use client";
import { Graph } from "./Graph";

export const GraphWrapper = ({
  value,
  continuum,
}: {
  value?: number;
  continuum?: { cfd: string; libelle?: string };
}) => (
  <>
    {value !== undefined && !Number.isNaN(value) ? (
      <>
        {value.toFixed()}%
        <Graph
          continuum={continuum}
          value={value}
          width="100px"
          display="inline-block"
          ml="2"
        />
      </>
    ) : (
      "-"
    )}
  </>
);
