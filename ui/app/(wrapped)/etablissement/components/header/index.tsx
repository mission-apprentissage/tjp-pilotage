import { useEtablissementContext } from "../../context/etablissementContext";

const EtablissementHeader = () => {
  const { uai } = useEtablissementContext();
  return <div>Header (uai: {uai})</div>;
};

export { EtablissementHeader };
