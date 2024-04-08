"use client";

import { EtablissementAnalyseDetaillee } from "../components/analyse-detaillee";
import { EtablissementMap } from "../components/carto";
import { EtablissementHeader } from "../components/header";
import { LiensUtilesSection } from "../components/liens-utiles";
import { EtablissementContextProvider } from "../context/etablissementContext";

export default function PanoramaEtablissement({
  params,
}: {
  params: { uai: string };
}) {
  return (
    <EtablissementContextProvider value={{ uai: params.uai }}>
      <EtablissementHeader />
      <EtablissementAnalyseDetaillee />
      <EtablissementMap />
      <LiensUtilesSection />
    </EtablissementContextProvider>
  );
}
