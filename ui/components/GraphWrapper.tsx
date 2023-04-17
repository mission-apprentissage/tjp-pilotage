"use client";
import { Graph } from "./Graph";

export const GraphWrapper = ({
  value,
  centered,
}: {
  value?: number;
  centered?: boolean;
}) => (
  <>
    {value !== undefined && !Number.isNaN(value) ? (
      <>
        {value.toFixed()}%
        <Graph
          centered={centered}
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
