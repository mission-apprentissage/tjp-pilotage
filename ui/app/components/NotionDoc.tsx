"use client";
import { Suspense } from "react";
import { NotionRenderer } from "react-notion-x";

export const Doc = ({ recordMap }: { recordMap: any }) => {
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
