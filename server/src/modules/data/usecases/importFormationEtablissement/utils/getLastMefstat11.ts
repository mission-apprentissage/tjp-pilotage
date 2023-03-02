import { NMefLine } from "../../../files/NMef";

export const getLastMefstat11 = ({
  nMefs,
  nMefAnnee1,
}: {
  nMefs: NMefLine[];
  nMefAnnee1: NMefLine;
}) => {
  return nMefs.find(
    (item) =>
      item.DUREE_DISPOSITIF === nMefAnnee1.DUREE_DISPOSITIF &&
      item.DUREE_DISPOSITIF === item.ANNEE_DISPOSITIF
  );
};
