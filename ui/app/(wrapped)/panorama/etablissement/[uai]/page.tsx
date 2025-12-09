"use client";

import { use } from "react";

import { EtablissementAnalyseDetaillee } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee";
import { EtablissementMap } from "@/app/(wrapped)/panorama/etablissement/components/carto";
import { EtablissementHeader } from "@/app/(wrapped)/panorama/etablissement/components/header";
import { LiensUtilesSection } from "@/app/(wrapped)/panorama/etablissement/components/liens-utiles";
import { EtablissementContextProvider } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";

export default function PanoramaEtablissement({
  params,
}: {
  readonly params: Promise<{
    uai: string;
}>;
}) {
  const { uai } = use(params);
  return (
    <EtablissementContextProvider value={{ uai }}>
      <EtablissementHeader />
      <EtablissementAnalyseDetaillee />
      <EtablissementMap />
      <LiensUtilesSection />
    </EtablissementContextProvider>
  );
}
