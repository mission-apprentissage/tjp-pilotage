"use client";

import { EtablissementAnalyseDetaillee } from "../components/analyse-detaillee";
import { LiensUtilesSection } from "../components/analyse-detaillee/liens-utiles/LiensUtilesSection";
import { EtablissementMap } from "../components/carto";
import { EtablissementHeader } from "../components/header";
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
