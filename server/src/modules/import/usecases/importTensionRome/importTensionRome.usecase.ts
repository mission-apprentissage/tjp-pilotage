import { importTensionRomeDepartement } from "./steps/importTensionRomeDepartement.step";
import { importTensionRomeNational } from "./steps/importTensionRomeNational.step";
import { importTensionRomeRegion } from "./steps/importTensionRomeRegion.step";
import { deleteTension } from "./steps/utils";

export const importTensionRome = async () => {
  console.log(`Suppression des tensions`);
  await deleteTension();
  console.log("Import des données de tension depuis les fichiers à la maille nationale\n");
  await importTensionRomeNational();
  console.log("Import des données de tension depuis les fichiers à la maille régionale\n");
  await importTensionRomeRegion();
  console.log("Import des données de tension depuis les fichiers à la maille départementale\n");
  await importTensionRomeDepartement();
};
