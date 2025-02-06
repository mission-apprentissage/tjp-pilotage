"use client";

import { createContext} from 'react';

export const CodeDepartementContext = createContext<{
  codeDepartement?: string;
  setCodeDepartement: (codeDepartement?: string) => void;
    }>({ setCodeDepartement: () => {} });
