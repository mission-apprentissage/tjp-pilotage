"use client";
import { Graph } from "./Graph";

export const GraphWrapper = ({
  value,
  centered,
  zebra,
}: {
  value?: number;
  centered?: boolean;
  zebra?: boolean;
}) => (
  <>
    {value !== undefined && !Number.isNaN(value) ? (
      <>
        {value.toFixed()}%
        <Graph
          zebra={zebra}
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
