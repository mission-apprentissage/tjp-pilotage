import { createContext, useContext, useState } from "react";

type EtablissementContextType = {
  uai: string;
  setUai: (uai: string) => void;
  //etablissement: Etablissement
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

  const context = {
    uai,
    setUai,
  };

  return (
    <EtablissementContext.Provider value={context}>
      {children}
    </EtablissementContext.Provider>
  );
}

export const useEtablissementContext = () => useContext(EtablissementContext);
