import { useEtablissementContext } from "../../context/etablissementContext";

const EtablissementAnalyseDetaillee = () => {
  const { uai } = useEtablissementContext();
  return <div>Analyse detaillee (uai : {uai})</div>;
};

export { EtablissementAnalyseDetaillee };
