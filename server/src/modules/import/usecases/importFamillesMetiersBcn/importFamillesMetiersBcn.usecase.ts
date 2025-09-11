import { importFamillesMetiersDepsBcn } from "./importFamillesMetiersBcn.deps";

export const importFamillesMetiersBcnFactory =
  ({
    createFamillesMetiersBcn = importFamillesMetiersDepsBcn.createFamillesMetiersBcn,
    updateCfdFamille = importFamillesMetiersDepsBcn.updateCfdFamille,
    findNatureCfd = importFamillesMetiersDepsBcn.findNatureCfd,
    getCfdLienFormationGroupe = importFamillesMetiersDepsBcn.getCfdLienFormationGroupe,
    findGroupe = importFamillesMetiersDepsBcn.findGroupe,
    findLibelleGroupe = importFamillesMetiersDepsBcn.findLibelleGroupe,
    findTypeGroupe = importFamillesMetiersDepsBcn.findTypeGroupe,
    findLibelleTypeGroupe = importFamillesMetiersDepsBcn.findLibelleTypeGroupe,

  }) =>
    async () => {

      /*
        const res = await findCfdFamille({cfd: "40031211"});
        console.log(res)
        return res;
        */
      console.log("\n\nImport des Familles de Métiers via les 3 fichiers BCN...");

      //pour chaque FORMATION_DIPLOME dans N_LIEN_FORMATION_GROUPE
      const listeCfd = await getCfdLienFormationGroupe();
      let compteurCfd = 0;

      for (const cfd of listeCfd){

        const groupe = await findGroupe({cfd}) || "";
        const libelleGroupe = await findLibelleGroupe({cfd}) || "";
        const typeGroupe = await findTypeGroupe({groupe}) || "";
        const libelleTypeGroupe = await findLibelleTypeGroupe({groupe}) || "";

        //on n'importe que si la donnée existe
        if(cfd && groupe && libelleGroupe && typeGroupe && libelleTypeGroupe){


          const data = {
            libelleFamille: libelleGroupe,
            cfdFamille: "",
            cfd: cfd,
            groupe: groupe,
            typeGroupe: libelleTypeGroupe
          };

          compteurCfd++;
          process.stdout.write(`\r${compteurCfd} formations avec classes communes importées.`);
          await createFamillesMetiersBcn(data);
        }
      }

      console.log("\nImport des CFD Familles ...");

      // Il faut itérer une seconde fois pour remplir le champ cfdFamille
      compteurCfd = 0;
      for (const cfd of listeCfd){

        compteurCfd++;

        //récupérer le groupe
        const groupe = await findGroupe({cfd}) || "";

        //récupérer la NATURE_FORMATION_DIPLOME dans le fichier N_FORMATION_DIPLOME
        const nature = await findNatureCfd({cfd});

        //si NATURE_FORMATION_DIPLOME vaut T alors stocker le cfd en cours dans familleMetier.cfdFamille du groupe auquel le cfd en cours appartient
        if(nature === "T"){

          process.stdout.write(`\rCFD n°${compteurCfd} : ${cfd}`);
          await updateCfdFamille({cfd, groupe});
        }


      }


      console.log("\nImport des Familles de Métiers via les 3 fichiers BCN terminé.\n\n");

      return true;
    };

export const importFamillesMetiersBcn = importFamillesMetiersBcnFactory({});
