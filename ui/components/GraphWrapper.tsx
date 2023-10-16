"use client";
import { Graph } from "./Graph";

export const GraphWrapper = ({
  value,
  continuum,
}: {
  value?: number;
  continuum?: boolean;
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
