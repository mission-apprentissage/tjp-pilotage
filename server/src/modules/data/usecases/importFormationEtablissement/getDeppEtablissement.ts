import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";

const ijUaiData: Record<
  string,
  Awaited<ReturnType<typeof inserJeunesApi.getUaiData>> | undefined
> = {};

export const getDeppEtablissementFactory =
  ({ getUaiData = inserJeunesApi.getUaiData } = {}) =>
  async ({ uai, millesime }: { uai: string; millesime: string }) => {
    if (uai in ijUaiData) {
      return ijUaiData[`${uai}_${millesime}`];
    }
    const data = await getUaiData({ uai, millesime });
    if (!data) {
      // logs.uais.push({ uai, millesime });
    }
    ijUaiData[`${uai}_${millesime}`] = data;
    return data;
  };
