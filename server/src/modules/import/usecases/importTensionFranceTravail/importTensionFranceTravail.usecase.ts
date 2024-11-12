import { importTensionFranceTravailDepartement } from "./steps/importTensionFranceTravailDepartement.step";
import { importTensionFranceTravailNational } from "./steps/importTensionFranceTravailNational.step";
import { importTensionFranceTravailRegion } from "./steps/importTensionFranceTravailRegion.step";

export const importTensionFranceTravail = async (maille?: string) => {
  switch (maille) {
    case "national":
      console.log(
        "Import des données de tension depuis l'API France travail à la maille nationale\n\n"
      );
      await importTensionFranceTravailNational();
      break;
    case "region":
      console.log(
        "Import des données de tension depuis l'API France travail à la maille régionale\n\n"
      );
      await importTensionFranceTravailRegion();
      break;
    case "departement":
      console.log(
        "Import des données de tension depuis l'API France travail à la maille départementale\n\n"
      );
      await importTensionFranceTravailDepartement();
      break;
    default:
      console.log(
        "Import des données de tension depuis l'API France travail à la maille nationale\n\n"
      );
      await importTensionFranceTravailNational();
      console.log(
        "Import des données de tension depuis l'API France travail à la maille régionale\n\n"
      );
      await importTensionFranceTravailRegion();
      console.log(
        "Import des données de tension depuis l'API France travail à la maille départementale\n\n"
      );
      await importTensionFranceTravailDepartement();
      break;
  }
};
