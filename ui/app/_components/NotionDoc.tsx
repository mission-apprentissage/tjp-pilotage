"use client";
import { Box } from "@chakra-ui/react";
import type { ExtendedRecordMap } from "notion-types";
import { Suspense } from "react";
import { NotionRenderer } from "react-notion-x";
export const Doc = ({ recordMap, pageTitle }: { recordMap: ExtendedRecordMap, pageTitle?: React.ReactNode }) => {
  return (
    <Suspense>
      <Box>
        <NotionRenderer
          pageTitle={pageTitle}
          disableHeader={true}
          recordMap={recordMap}
          fullPage={true}
          darkMode={false}
        />
      </Box>
    </Suspense>
  );
};
