import { createContext, useContext, useState } from "react";

import type { client } from "@/api.client";

export type AnalyseDetailleeType = (typeof client.infer)["[GET]/etablissement/:uai/analyse-detaillee"];

type EtablissementContextType = {
  uai: string;
  setUai: (uai: string) => void;
  analyseDetaillee: AnalyseDetailleeType | undefined;
  setAnalyseDetaillee: (data: AnalyseDetailleeType) => void;
};

interface EtablissementContextProps {
  children: React.ReactNode;
  value?: Partial<EtablissementContextType>;
}

export const EtablissementContext = createContext<EtablissementContextType>({} as EtablissementContextType);

export function EtablissementContextProvider({ children, value }: EtablissementContextProps) {
  const [uai, setUai] = useState(value?.uai ?? "");
  const [analyseDetaillee, setAnalyseDetaillee] = useState<AnalyseDetailleeType>();

  const context = {
    uai,
    setUai,
    analyseDetaillee,
    setAnalyseDetaillee,
  };

  return <EtablissementContext.Provider value={context}>{children}</EtablissementContext.Provider>;
}

export const useEtablissementContext = () => useContext(EtablissementContext);
