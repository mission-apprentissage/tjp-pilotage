
export const parseCfd = (mef: string, duree: number): number => {
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
    return 378;

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
