import type { FormationIndicateurs, TauxIJType } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

export const displaySoldeDePlacesTransformees = (data: FormationIndicateurs): boolean => {
  return data?.soldePlacesTransformee !== undefined && data?.soldePlacesTransformee.length > 0;
};

export const displayIJDatas = (data: FormationIndicateurs, tauxIJSelected: TauxIJType) => {
  return (
    data.tauxIJ[tauxIJSelected].length > 0 &&
    data.tauxIJ[tauxIJSelected].some(
      (data) => typeof data.apprentissage !== "undefined" || typeof data.scolaire !== "undefined",
    )
  );
};

export const displayEffectifsDatas = (data: FormationIndicateurs) => {
  return data.effectifs.length > 0;
};

export const displayEtablissementsDatas = (data: FormationIndicateurs) => {
  return data.etablissements.length > 0;
};

export const displayTauxAttractiviteDatas = (data: Record<string, Array<number | undefined>>) => {
  return (
    Object.keys(data).length > 0 &&
    Object.values(data).some((d) => d.length > 0) &&
    Object.values(data).some((d) => d.some((v) => v !== undefined))
  );
};
