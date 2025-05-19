import { useSearchParams } from "next/navigation";

export const useDomaineDeFormationSearchParams = () => {
  const searchParams = useSearchParams();
  const codeRegion = searchParams.get("codeRegion") ?? undefined;
  const codeAcademie = searchParams.get("codeAcademie") ?? undefined;
  const codeDepartement = searchParams.get("codeDepartement") ?? undefined;
  const cfd = searchParams.get("cfd") ?? undefined;
  const presence = searchParams.get("presence") ?? undefined;
  const voie = searchParams.get("voie") ?? undefined;

  return {
    codeRegion: codeRegion,
    codeAcademie: codeAcademie,
    codeDepartement: codeDepartement,
    cfd: cfd,
    presence: presence,
    voie: voie
  };
};
