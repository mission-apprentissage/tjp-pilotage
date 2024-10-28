"use client";

import { EtablissementAnalyseDetaillee } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee";
import { EtablissementMap } from "@/app/(wrapped)/panorama/etablissement/components/carto";
import { EtablissementHeader } from "@/app/(wrapped)/panorama/etablissement/components/header";
import { LiensUtilesSection } from "@/app/(wrapped)/panorama/etablissement/components/liens-utiles";
import { EtablissementContextProvider } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";

export default function PanoramaEtablissement({ params }: { params: { uai: string } }) {
  return (
    <EtablissementContextProvider value={{ uai: params.uai }}>
      <EtablissementHeader />
      <EtablissementAnalyseDetaillee />
      <EtablissementMap />
      <LiensUtilesSection />
    </EtablissementContextProvider>
  );
}
