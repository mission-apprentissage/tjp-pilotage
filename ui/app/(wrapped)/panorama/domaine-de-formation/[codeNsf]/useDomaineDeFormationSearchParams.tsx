import { useSearchParams } from "next/navigation";

import type { Voie } from "./types";

export const useDomaineDeFormationSearchParams = () => {
  const searchParams = useSearchParams();
  const codeRegion = searchParams.get("codeRegion") ?? undefined;
  const codeAcademie = searchParams.get("codeAcademie") ?? undefined;
  const codeDepartement = searchParams.get("codeDepartement") ?? undefined;
  const cfd = searchParams.get("cfd") ?? undefined;
  const presence = searchParams.get("presence") ?? undefined;
  const voie = searchParams.get("voie") ?? "";

  return {
    codeRegion: codeRegion,
    codeAcademie: codeAcademie,
    codeDepartement: codeDepartement,
    cfd: cfd,
    presence: presence,
    voie: voie as Voie
  };
};
