export const formatTauxTransformation = (transformes: number | undefined, effectif: number | undefined) => {

  if(typeof effectif === "undefined"){
    return undefined;
  }

  if(typeof transformes === "undefined"){
    return 0;
  }

  return Number.parseFloat((transformes / effectif).toFixed(4));
};
