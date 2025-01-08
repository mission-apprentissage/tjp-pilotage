import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { importLienEmploiFormation as importLienEmploiFormationDeps } from "./importLienEmploiFormation.deps";

export const importLienEmploiFormationFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createDomaineProfessionnel = importLienEmploiFormationDeps.createDomaineProfessionnel,
    createRome = importLienEmploiFormationDeps.createRome,
    createMetier = importLienEmploiFormationDeps.createMetier,
    selectDiplomeProCfd = importLienEmploiFormationDeps.selectDiplomeProCfd,
    createFormationRome = importLienEmploiFormationDeps.createFormationRome,
    deleteDomaineProfessionnel = importLienEmploiFormationDeps.deleteDomaineProfessionnel,
    deleteRome = importLienEmploiFormationDeps.deleteRome,
    deleteMetier = importLienEmploiFormationDeps.deleteMetier,
    deleteFormationRome = importLienEmploiFormationDeps.deleteFormationRome,
  }) =>
  async () => {
    console.log(`Suppression des formationsRome`);
    await deleteFormationRome();
    console.log(`Suppression des métiers`);
    await deleteMetier();
    console.log(`Suppression des fichers ROME`);
    await deleteRome();
    console.log(`Suppression des domaines professionnels`);
    await deleteDomaineProfessionnel();

    console.log(`Import des domaines professionnels`);
    let domainesProfessionnels = 0;
    await streamIt(
      async (countDomaineProfessionnel) =>
        findRawDatas({
          type: "domaine_professionnel",
          offset: countDomaineProfessionnel,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["domaineProfessionnel"]> = {
          codeDomaineProfessionnel: item.code_domaine_professionnel,
          libelleDomaineProfessionnel: item.libelle_domaine_professionnel,
        };

        await createDomaineProfessionnel(data);

        domainesProfessionnels++;
        process.stdout.write(`\r${domainesProfessionnels} domaines professionnels ajoutés`);
      },
      { parallel: 20 },
    );

    console.log(`\nImport des fiches ROME`);
    let rome = 0;
    await streamIt(
      async (countRome) =>
        findRawDatas({
          type: "rome",
          offset: countRome,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["rome"]> = {
          codeRome: item.code_rome,
          libelleRome: item.libelle_rome,
          codeDomaineProfessionnel: item.code_rome.substring(0, 3),
          transitionEcologique: item.transition_eco?.includes("Emploi stratégique pour la Transition écologique"),
          transitionNumerique: item.transition_num?.includes("O"),
          transitionDemographique: item.transition_demo?.includes("O"),
        };

        await createRome(data);

        rome++;
        process.stdout.write(`\r${rome} fiches ROME ajoutées`);
      },
      { parallel: 20 },
    );

    console.log(`\nImport des métiers`);
    let metiers = 0;
    await streamIt(
      async (countMetier) =>
        findRawDatas({
          type: "metier",
          offset: countMetier,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["metier"]> = {
          codeRome: item.code_rome.trim(),
          libelleMetier: item.libelle_appellation_long.trim(),
          codeMetier: item.code_ogr.trim(),
        };

        await createMetier(data);

        metiers++;
        process.stdout.write(`\r${metiers} métiers ajoutés`);
      },
      { parallel: 20 },
    );

    console.log(`\nImport des formationsRome`);
    let formationRomeCount = 0;
    await streamIt(
      async (diplomeProCfd) =>
        selectDiplomeProCfd({
          offset: diplomeProCfd,
          limit: 10000,
        }),
      async (formation) => {
        const formationsRome = await findRawDatas({
          type: "certif_info",
          filter: {
            Code_Scolarité: formation.cfd,
          },
          limit: 100,
        });

        for (const formationRome of formationsRome) {
          const codesRome = [
            formationRome.Code_Rome_1,
            formationRome.Code_Rome_2,
            formationRome.Code_Rome_3,
            formationRome.Code_Rome_4,
            formationRome.Code_Rome_5,
          ];

          for (const codeRome of codesRome) {
            if (codeRome) {
              const data: Insertable<DB["formationRome"]> = {
                codeRome: codeRome,
                cfd: formation.cfd,
              };

              try {
                await createFormationRome(data);
              } catch (_err) {
                console.log(
                  `\nProblème en ajoutant le couple CFD ${data.cfd} / ROME ${data.codeRome}. Il est probable que le CFD ou le code ROME n'existe pas dans notre base.`,
                );
              }
              formationRomeCount++;
            }
          }
        }
        process.stdout.write(`\r${formationRomeCount} formationRome ajoutées`);
      },
      { parallel: 20 },
    );
  };

export const importLienEmploiFormation = importLienEmploiFormationFactory({});
