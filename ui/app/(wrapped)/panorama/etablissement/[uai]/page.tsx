"use client";

import { EtablissementAnalyseDetaillee } from "../components/analyse-detaillee";
import { EtablissementMap } from "../components/carto";
import { EtablissementHeader } from "../components/header";
import { EtablissementContextProvider } from "../context/etablissementContext";

interface EtablissementPageProps {
  params: {
    uai: string;
  };
}

const EtablissementPage = ({ params: { uai } }: EtablissementPageProps) => {
  return (
    <EtablissementContextProvider value={{ uai }}>
      <EtablissementHeader />
      <EtablissementAnalyseDetaillee />
      <EtablissementMap />
    </EtablissementContextProvider>
  );
};

export default EtablissementPage;
