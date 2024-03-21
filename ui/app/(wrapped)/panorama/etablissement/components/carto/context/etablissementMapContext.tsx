import { createContext, useContext, useState } from "react";

import { client } from "@/api.client";

type EtablissementMapType =
  (typeof client.infer)["[GET]/etablissement/:uai/map"];

type EtablissementListType =
  (typeof client.infer)["[GET]/etablissement/:uai/map/list"];

interface Bbox {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

type EtablissementMapContextType = {
  etablissementMap: EtablissementMapType | undefined;
  setEtablissementMap: (data: EtablissementMapType) => void;
  etablissementsProches: EtablissementMapType["etablissementsProches"];
  etablissementList: EtablissementListType;
  setEtablissementList: (data: EtablissementListType) => void;
  bbox: Bbox;
  setBbox: (bbox: Bbox) => void;
};

interface EtablissementMapContextProps {
  children: React.ReactNode;
  value?: Partial<EtablissementMapContextType>;
}

export const EtablissementMapContext =
  createContext<EtablissementMapContextType>({} as EtablissementMapContextType);

export function EtablissementMapContextProvider({
  children,
  value,
}: EtablissementMapContextProps) {
  const [bbox, setBbox] = useState({
    minLat: value?.bbox?.minLat || 0,
    minLng: value?.bbox?.minLng || 0,
    maxLat: value?.bbox?.maxLat || 0,
    maxLng: value?.bbox?.maxLng || 0,
  });
  const [etablissementMap, setEtablissementMap] =
    useState<EtablissementMapType>();
  const [etablissementList, setEtablissementList] =
    useState<EtablissementListType>({ etablissements: [] });

  const context = {
    etablissementMap,
    setEtablissementMap,
    bbox,
    setBbox,
    etablissementsProches: etablissementMap?.etablissementsProches || [],
    etablissementList,
    setEtablissementList,
  };

  return (
    <EtablissementMapContext.Provider value={context}>
      {children}
    </EtablissementMapContext.Provider>
  );
}

export const useEtablissementMapContext = () =>
  useContext(EtablissementMapContext);