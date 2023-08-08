// eslint-disable-next-line no-useless-escape
export const checkMillesimeFormat = (millesime: string): boolean =>
  /^\d{4}_\d{4}$/g.test(millesime);

export const getMillesimeFromYear = (year: number): string => {
  const currentMillesime = `${year - 1}_${year}`;

  return currentMillesime;
};

export const getPreviousMillesime = (millesime: string): string => {
  if (checkMillesimeFormat(millesime)) {
    const startingYear = +millesime.substring(0, 4);
    return `${startingYear - 1}_${startingYear}`;
  }
  return getCurrentMillesime();
};

export const getCurrentMillesime = (): string =>
  getMillesimeFromYear(new Date().getFullYear());

export const getNextMillesime = (millesime: string): string | null => {
  if (checkMillesimeFormat(millesime)) {
    const finishingYear = +millesime.substring(5);
    return `${finishingYear}_${finishingYear + 1}`;
  }
  return null;
};

export const getMillesimeFromRentreeScolaire = (
  rentreeScolaire: string
): string => `${+rentreeScolaire - 2}_${+rentreeScolaire - 1}`;
