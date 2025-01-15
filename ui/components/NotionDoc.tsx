"use client";
import { Box } from "@chakra-ui/react";
import type { ExtendedRecordMap } from "notion-types";
import { Suspense } from "react";
import { NotionRenderer } from "react-notion-x";
export const Doc = ({ recordMap }: { recordMap: ExtendedRecordMap }) => {
  return (
    <Suspense>
      <Box>
        <NotionRenderer pageTitle={false} disableHeader={true} recordMap={recordMap} fullPage={true} darkMode={false} />
      </Box>
    </Suspense>
  );
};
