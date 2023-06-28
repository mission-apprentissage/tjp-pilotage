import { inject } from "injecti";
import { Insertable, Selectable } from "kysely";
import { DateTime } from "luxon";

import { DB } from "../../../../../../db/schema";
import { LyceesACCELine } from "../../../../files/LyceesACCELine";
import { dependencies } from "../../dependencies.di";

export const [importEtablissement] = inject(
  {
    createEtablissement: dependencies.createEtablissement,
    findLyceeACCE: dependencies.findLyceeACCE,
    findDepartement: dependencies.findDepartement,
  },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const lyceeACCE = await deps.findLyceeACCE({ uai });

      const codeDepartement = formatCodeDepartement(
        lyceeACCE?.departement_insee_3
      );
      const departement =
        codeDepartement && (await deps.findDepartement({ codeDepartement }));

      const etablissement = toEtablissement({
        uai,
        lyceeACCE,
        departement,
      });
      await deps.createEtablissement(etablissement);
    }
);

const formatCodeDepartement = (codeInsee: string | undefined) => {
  if (!codeInsee) return;
  if (codeInsee.length === 3) return codeInsee as `${number}${number}${string}`;
  if (codeInsee.length === 2)
    return `0${codeInsee}` as `${number}${number}${string}`;
};

const toEtablissement = ({
  uai,
  lyceeACCE,
  departement,
}: {
  uai: string;
  lyceeACCE?: LyceesACCELine;
  departement?: Selectable<DB["departement"]>;
}): Insertable<DB["etablissement"]> => {
  return {
    UAI: uai,
    siret: lyceeACCE?.numero_siren_siret_uai,
    codeAcademie: departement?.codeAcademie,
    codeRegion: departement?.codeRegion,
    codeDepartement: departement?.codeDepartement,
    natureUAI: lyceeACCE?.nature_uai,
    libelleEtablissement: lyceeACCE?.appellation_officielle,
    adresseEtablissement: lyceeACCE?.adresse_uai,
    commune: lyceeACCE?.commune_libe,
    codePostal: lyceeACCE?.code_postal_uai,
    secteur: lyceeACCE?.secteur_public_prive,
    dateOuverture:
      lyceeACCE &&
      DateTime.fromFormat(lyceeACCE.date_ouverture, "dd/LL/yyyy").toJSDate(),
    dateFermeture: lyceeACCE?.date_fermeture
      ? DateTime.fromFormat(lyceeACCE.date_fermeture, "dd/LL/yyyy").toJSDate()
      : null,
    codeMinistereTutuelle: lyceeACCE?.ministere_tutelle,
  };
};
