import {createContext} from 'react';

export const CodeRegionContext = createContext<{
  codeRegion?: string;
  setCodeRegion: (codeRegion?: string) => void;
    }>({ setCodeRegion: () => {} });
