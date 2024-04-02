"use client";

import { EtablissementAnalyseDetaillee } from "../components/analyse-detaillee";
import { EtablissementMap } from "../components/carto";
import { EtablissementHeader } from "../components/header";
import { LiensUtilesSection } from "../components/liens-utiles";
import { EtablissementContextProvider } from "../context/etablissementContext";

export const EtablissementPage = ({
  params: { uai },
}: {
  params: { uai: string };
}) => {
  return (
    <EtablissementContextProvider value={{ uai }}>
      <EtablissementHeader />
      <EtablissementAnalyseDetaillee />
      <EtablissementMap />
      <LiensUtilesSection />
    </EtablissementContextProvider>
  );
};
