"use client";

import { EtablissementAnalyseDetaillee } from "../components/analyse-detaillee";
import { EtablissementHeader } from "../components/header";
import { EtablissementContextProvider } from "../context/etablissementContext";
import EtablissementLayout from "./layout";

interface EtablissementPageProps {
  params: {
    uai: string;
  };
}

const EtablissementPage = ({ params: { uai } }: EtablissementPageProps) => {
  return (
    <EtablissementContextProvider value={{ uai }}>
      <EtablissementLayout>
        <EtablissementHeader />
        <EtablissementAnalyseDetaillee />
      </EtablissementLayout>
    </EtablissementContextProvider>
  );
};

export default EtablissementPage;
