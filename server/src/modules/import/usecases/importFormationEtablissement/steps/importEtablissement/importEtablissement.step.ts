// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { Insertable, Selectable } from "kysely";
import { DateTime } from "luxon";

import type { DB } from "@/db/db";
import type { LyceesACCELine } from "@/modules/import/fileTypes/LyceesACCELine";

import { createEtablissement } from "./createEtablissement.dep";
import { findDepartement } from "./findDepartement.dep";
import type { EtablissementGeoloc } from "./findGeoloc.dep";
import { findEtablissementGeoloc } from "./findGeoloc.dep";
import { findLyceeACCE } from "./findLyceeAcce.dep";

export const [importEtablissement] = inject(
  {
    createEtablissement,
    findLyceeACCE,
    findDepartement,
  },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const lyceeACCE = await deps.findLyceeACCE({ uai });

      const codeDepartement = formatCodeDepartement(lyceeACCE?.departement_insee_3);
      const departement = codeDepartement && (await deps.findDepartement({ codeDepartement }));

      const geoloc = await findEtablissementGeoloc({ uai, lyceeACCE });

      const etablissement = toEtablissement({
        uai,
        lyceeACCE,
        departement,
        geoloc,
      });

      await deps.createEtablissement(etablissement);
    }
);

const formatCodeDepartement = (codeInsee: string | undefined) => {
  if (!codeInsee) return;
  if (codeInsee.length === 3) return codeInsee as `${number}${number}${string}`;
  if (codeInsee.length === 2) return `0${codeInsee}` as `${number}${number}${string}`;
};

const toEtablissement = ({
  uai,
  lyceeACCE,
  departement,
  geoloc,
}: {
  uai: string;
  lyceeACCE?: LyceesACCELine;
  departement?: Selectable<DB["departement"]>;
  geoloc?: EtablissementGeoloc;
}): Insertable<DB["etablissement"]> => {
  return {
    uai: uai,
    siret: lyceeACCE?.numero_siren_siret_uai,
    codeAcademie: departement?.codeAcademie,
    codeRegion: departement?.codeRegion,
    codeDepartement: departement?.codeDepartement,
    natureUAI: lyceeACCE?.nature_uai,
    libelleEtablissement: lyceeACCE?.appellation_officielle,
    secteur: lyceeACCE?.secteur_public_prive,
    dateOuverture: lyceeACCE && DateTime.fromFormat(lyceeACCE.date_ouverture, "dd/LL/yyyy").toJSDate(),
    dateFermeture: lyceeACCE?.date_fermeture
      ? DateTime.fromFormat(lyceeACCE.date_fermeture, "dd/LL/yyyy").toJSDate()
      : null,
    codeMinistereTutuelle: lyceeACCE?.ministere_tutelle,
    adresseEtablissement: geoloc?.adresse,
    commune: geoloc?.commune,
    codePostal: geoloc?.codePostal,
    latitude: geoloc?.latitude,
    longitude: geoloc?.longitude,
    sourceGeoloc: geoloc?.source,
  };
};
