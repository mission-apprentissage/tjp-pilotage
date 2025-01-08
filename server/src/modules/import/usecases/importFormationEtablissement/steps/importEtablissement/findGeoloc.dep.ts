import type { LyceesACCELine } from "@/modules/import/fileTypes/LyceesACCELine";
import type { StructureDenseignement } from "@/modules/import/fileTypes/Structures_denseignement";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { findAddress } from "@/modules/import/services/ban/ban.api";

export type EtablissementGeolocSource = "depp_acce" | "onisep_secondaire" | "onisep_supérieur" | "onisep";

export type EtablissementGeoloc = {
  adresse: string | null | undefined;
  codePostal: string | null | undefined;
  commune: string | null | undefined;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  source: EtablissementGeolocSource;
};

const resultAppearMoreThanOnce = (secondaire: StructureDenseignement[], superieur: StructureDenseignement[]) =>
  secondaire.length > 0 && superieur.length > 0;

const resultAppearOnlyOnce = (secondaire: StructureDenseignement[], superieur: StructureDenseignement[]) =>
  secondaire.length === 1 || superieur.length === 1;

const mapEtablissementGeoloc = (
  etablissement: StructureDenseignement,
  source: EtablissementGeolocSource,
): EtablissementGeoloc => ({
  adresse: etablissement["adresse"]?.replace(/"/g, ""),
  codePostal: etablissement["CP"],
  commune: etablissement["commune"]?.replace(/"/g, ""),
  latitude: Number(etablissement['"latitude (Y)"']),
  longitude: Number(etablissement['"longitude (X)"']),
  source,
});

const allAddressAreIdenticals = (secondaire: StructureDenseignement[], superieur: StructureDenseignement[]) => {
  const all = [...secondaire, ...superieur];

  if (all.length === 0) {
    return false;
  }

  const longitude = all[0]['"longitude (X)"'];
  const latitude = all[0]['"latitude (Y)"'];

  return all.every((a) => a['"longitude (X)"'] === longitude && a['"latitude (Y)"'] === latitude);
};

export const findEtablissementGeoloc = async ({
  uai,
  lyceeACCE,
}: {
  uai: string;
  lyceeACCE?: LyceesACCELine;
}): Promise<EtablissementGeoloc> => {
  const [secondaire, superieur] = await Promise.all([
    rawDataRepository.findRawDatas({
      type: "onisep_structures_denseignement_secondaire",
      filter: { '"code UAI"': uai },
    }),
    rawDataRepository.findRawDatas({
      type: "onisep_structures_denseignement_superieur",
      filter: { '"code UAI"': uai },
    }),
  ]);

  if (resultAppearMoreThanOnce(secondaire, superieur)) {
    if (allAddressAreIdenticals(secondaire, superieur)) {
      return mapEtablissementGeoloc(secondaire[0], "onisep");
    }
    const etablissementsDuSecondaire = secondaire.filter((s) => s.CP === lyceeACCE?.code_postal_uai);
    const etablissementsDuSup = superieur.filter((s) => s.CP === lyceeACCE?.code_postal_uai);

    if (etablissementsDuSecondaire.length > 0) {
      return mapEtablissementGeoloc(etablissementsDuSecondaire[0], "onisep_secondaire");
    }

    if (etablissementsDuSup.length > 0) {
      return mapEtablissementGeoloc(etablissementsDuSup[0], "onisep_supérieur");
    }
  }

  if (resultAppearOnlyOnce(secondaire, superieur)) {
    const geoDatas = secondaire.length > 0 ? secondaire[0] : superieur[0];
    const source = secondaire.length > 0 ? "onisep_secondaire" : "onisep_supérieur";

    return mapEtablissementGeoloc(geoDatas, source);
  }

  const search = [lyceeACCE?.adresse_uai, [lyceeACCE?.code_postal_uai, lyceeACCE?.commune_libe].join(" ")]
    .filter((n) => n)
    .join(", ");
  const resultFromBAN = await findAddress({
    search,
    limit: 1,
  });

  const [longitude, latitude] = resultFromBAN?.features[0]?.geometry?.coordinates ?? [];

  if (!latitude || !longitude) {
    console.log(
      `Aucune coordonnées de géoloc trouvée pour cet établissement: ${uai} / ${lyceeACCE?.appellation_officielle}, ${search} `,
    );
  }

  return {
    adresse: lyceeACCE?.adresse_uai,
    codePostal: lyceeACCE?.code_postal_uai,
    commune: lyceeACCE?.commune_libe,
    latitude,
    longitude,
    source: "depp_acce",
  };
};
