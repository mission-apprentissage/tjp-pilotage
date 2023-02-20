import { DateTime } from "luxon";

import { dataDI } from "../../data.DI";
import { streamIt } from "../../utils/streamIt";

export const importFormationEtablissementsFactory =
  ({
    createEtablissements = dataDI.createEtablissements,
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    findRawData = dataDI.rawDataRepository.findRawData,
  }) =>
  async () => {
    console.log(`Import des etablissements`);

    let count = 0;
    await streamIt(
      (count) =>
        findRawDatas({ type: "affelnet2nde", offset: count, limit: 20 }),
      async (item) => {
        if (item.Statut !== "ST") return;
        const lyceeACCE = await findRawData({
          key: item.Etablissement,
          type: "lyceesACCE",
        });
        if (!lyceeACCE) return;

        const data = {
          UAI: lyceeACCE.numero_uai,
          siret: lyceeACCE.numero_siren_siret_uai,
          codeAcademie: lyceeACCE.academie,
          natureUAI: lyceeACCE.nature_uai,
          libelleEtablissement: lyceeACCE.appellation_officielle,
          adresseEtablissement: lyceeACCE.adresse_uai,
          codePostal: lyceeACCE.code_postal_uai,
          secteur: lyceeACCE.secteur_public_prive,
          dateOuverture: DateTime.fromFormat(
            lyceeACCE.date_ouverture,
            "dd/LL/yyyy"
          ).toJSDate(),
          dateFermeture: lyceeACCE.date_fermeture
            ? DateTime.fromFormat(
                lyceeACCE.date_fermeture,
                "dd/LL/yyyy"
              ).toJSDate()
            : undefined,
          codeMinistereTutuelle: lyceeACCE.ministere_tutelle,
        };

        count++;
        process.stdout.write(`\r${count}`);

        await createEtablissements([data]);
      }
    );

    process.stdout.write(
      `\r${count} etablissements ajoutées ou mises à jour\n`
    );
  };

export const importFormationEtablissements =
  importFormationEtablissementsFactory({});
