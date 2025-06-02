"use client";

import { createContext, useContext, useState } from "react";

import type {
  NsfOptions,
} from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";

type InputNsfContextType = {
  codeNsf: string;
  libelleNsf: string;
  defaultNsfs: NsfOptions;
}

type NsfContextType = InputNsfContextType & {
  setDefaultNsfs: (nsfs: NsfOptions) => void;
  setCodeNsf: (codeNsf: string) => void;
  setLibelleNsf: (libelleNsf: string) => void;
};

type NsfContextProps = {
  children: React.ReactNode;
  value: InputNsfContextType;
};

export const NsfContext = createContext<NsfContextType>({} as NsfContextType);

export function NsfContextProvider({ children, value }: Readonly<NsfContextProps>) {
  const [defaultNsfs, setDefaultNsfs] = useState<NsfOptions>(value.defaultNsfs);
  const [codeNsf, setCodeNsf] = useState<string>(value.codeNsf);
  const [libelleNsf, setLibelleNsf] = useState<string>(value.libelleNsf);

  const context = {
    defaultNsfs,
    setDefaultNsfs,
    codeNsf,
    setCodeNsf,
    libelleNsf,
    setLibelleNsf
  };

  return <NsfContext.Provider value={context}>{children}</NsfContext.Provider>;
}

export const useNsfContext = () => useContext(NsfContext);
