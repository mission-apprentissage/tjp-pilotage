"use client";

import { useStateParams } from "../../../../utils/useFilters";

type Props = {
  codeNsf: string;
  libelleNsf: string;
};

export const PageDomaineDeFormationClient = () => {
  const [filters, setFilters] = useStateParams<{
    cfd?: string;
    codeRegion?: string;
    codeDepartement?: string;
    codeAcademie?: string;
  }>({ defaultValues: {} });

  return <p>Hello</p>;
};
