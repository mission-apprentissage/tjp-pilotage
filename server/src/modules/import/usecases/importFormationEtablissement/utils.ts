import { CURRENT_RENTREE } from "shared";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";

export const extractCfdFromMefAndDuree = (mef: string, duree: number): number => {
  const threeFirstChars = parseInt(mef.substring(0, 3));

  switch (threeFirstChars) {
  case 320:
    if (duree === 1) return 310;
    if (duree === 2) return 311;
    if (duree === 3) return 312;
    return -1;

  case 323:
    if (duree === 1) return 370;
    return -1;

  case 363:
    return 372;

  case 400:
    if (duree === 1 || duree === 2 || duree === 3) return 247;
    return -1;

  case 401:
    if (duree === 3) return 252;
    return -1;

  case 403:
    if (duree === 2) return 273;
    return -1;

  case 450:
    if (duree === 1 || duree === 2 || duree === 3) return 890;
    return -1;

  case 453:
    if (duree === 1) return 275;
    if (duree === 2) return 281;
    return -1;

  case 460:
    if (duree === 1) return 390;
    if (duree === 2) return 291;
    if (duree === 3) return 292;
    return -1;

  case 461:
    return 258;

  case 463:
    return 278;

  case 500:
    if (duree === 1) return 240;
    if (duree === 2) return 241;
    if (duree === 3) return 242;
    return -1;

  case 503:
    if (duree === 1) return 270;
    return -1;

  case 553:
    if (duree === 1) return 277;
    if (duree === 2) return 282;
    return -1;

  case 560:
    return 293;

  case 561:
    return 257;

  case 563:
    return 279;
  }

  return -1;
};


export const extractYearFromTags = (tags: string) => {
  const years: string[] = [];
  tags.split(',')
    .forEach((tag) => {
      const year = tag.length > 0 ? Number(tag.trim()) : NaN;
      const lastYear = year - 1;
      if (year <= parseInt(CURRENT_RENTREE) && years.indexOf('' + year) === -1) {
        years.push('' + year);
      }

      if (lastYear <= parseInt(CURRENT_RENTREE) && years.indexOf('' + lastYear) === -1) {
        years.push('' + lastYear);
      }
    });


  const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });
  return years.sort((a, b) =>
    collator.compare(a, b)
  );
};

export const isYearBetweenOuvertureAndFermeture =
  (year: string, dataFormation: { dateOuverture: Date | null, dateFermeture: Date | null } | undefined) => {
    const yearDate = new Date(getDateRentreeScolaire(year));
    if (!dataFormation?.dateOuverture) return false;
    const ouverture = new Date(dataFormation.dateOuverture);

    if (dataFormation?.dateFermeture) {
      const fermeture = new Date(dataFormation.dateFermeture);
      return yearDate <= fermeture && yearDate >= ouverture;
    }

    return yearDate >= ouverture;
  };
