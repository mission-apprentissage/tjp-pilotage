import { createContext} from 'react';



export const UaisContext = createContext<{
  uais?: Array<string>;
  setUais: (uais?: Array<string>) => void;
    }>({ setUais: () => {} });
