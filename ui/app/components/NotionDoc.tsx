"use client";
import { ExtendedRecordMap } from "notion-types";
import { Suspense } from "react";
import { NotionRenderer } from "react-notion-x";

export const Doc = ({ recordMap }: { recordMap: ExtendedRecordMap }) => {
  return (
    <Suspense>
      <NotionRenderer
        pageTitle={false}
        disableHeader={true}
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
      />
    </Suspense>
  );
};
