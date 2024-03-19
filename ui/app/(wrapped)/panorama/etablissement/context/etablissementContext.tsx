import { createContext, useContext, useState } from "react";

import { client } from "@/api.client";

type AnalyseDetailleeType =
  (typeof client.infer)["[GET]/etablissement/analyse-detaillee"];
type EtablissementMapType =
  (typeof client.infer)["[GET]/etablissement/:uai/map"];

type EtablissementContextType = {
  uai: string;
  setUai: (uai: string) => void;
  analyseDetaillee: AnalyseDetailleeType | undefined;
  setAnalyseDetaillee: (data: AnalyseDetailleeType) => void;
  etablissementMap: EtablissementMapType | undefined;
  setEtablissementMap: (data: EtablissementMapType) => void;
};

interface EtablissementContextProps {
  children: React.ReactNode;
  value?: Partial<EtablissementContextType>;
}

export const EtablissementContext = createContext<EtablissementContextType>(
  {} as EtablissementContextType
);

export function EtablissementContextProvider({
  children,
  value,
}: EtablissementContextProps) {
  const [uai, setUai] = useState(value?.uai ?? "");
  const [analyseDetaillee, setAnalyseDetaillee] =
    useState<AnalyseDetailleeType>();
  const [etablissementMap, setEtablissementMap] =
    useState<EtablissementMapType>();

  const context = {
    uai,
    setUai,
    analyseDetaillee,
    setAnalyseDetaillee,
    etablissementMap,
    setEtablissementMap,
  };

  return (
    <EtablissementContext.Provider value={context}>
      {children}
    </EtablissementContext.Provider>
  );
}

export const useEtablissementContext = () => useContext(EtablissementContext);
