"use client";

import { EtablissementAnalyseDetaillee } from "../components/analyse-detaillee";
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
      <div>Page en cours de construction. (uai : {uai})</div>
    </EtablissementContextProvider>
  );
};

export default EtablissementPage;
