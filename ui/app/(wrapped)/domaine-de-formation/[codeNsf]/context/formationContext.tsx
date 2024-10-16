"use client";

import { createContext, useContext, useState } from "react";

type FormationContextType = {
  codeNsf: string;
  cfd?: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
};

type FormationContextProps = {
  children: React.ReactNode;
  value?: Partial<FormationContextType>;
};

export const FormationContext = createContext<FormationContextType>({} as FormationContextType);

export function FormationContextProvider({ children, value }: FormationContextProps) {
  const [codeNsf, setCodeNsf] = useState(value?.codeNsf ?? "");
  const [cfd, setCfd] = useState(value?.cfd ?? "");
  const [codeRegion, setCodeRegion] = useState(value?.codeRegion ?? "");
  const [codeDepartement, setCodeDepartement] = useState(value?.codeDepartement ?? "");
  const [codeAcademie, setCodeAcademie] = useState(value?.codeAcademie ?? "");

  const context = {
    codeNsf,
    setCodeNsf,
    cfd,
    setCfd,
    codeRegion,
    setCodeRegion,
    codeDepartement,
    setCodeDepartement,
    codeAcademie,
    setCodeAcademie,
  };

  return <FormationContext.Provider value={context}>{children}</FormationContext.Provider>;
}

export const useFormationContext = () => useContext(FormationContext);
