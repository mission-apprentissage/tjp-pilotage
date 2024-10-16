import { Popup } from "react-map-gl/maplibre";

import { Etablissement } from "../../../../../types";
import { EtablissementItemContent } from "../components/EtablissementItemContent";

export const ActiveEtablissementPopup = ({
  etablissements,
  activeUai,
  onClose,
}: {
  etablissements: Etablissement[];
  activeUai: string | null;
  onClose: () => void;
}) => {
  const etablissement = etablissements.find((e) => e.uai === activeUai);

  if (!etablissement) {
    return null;
  }

  return (
    <Popup
      anchor="top"
      longitude={etablissement.longitude}
      latitude={etablissement.latitude}
      onClose={onClose}
      maxWidth={"357px"}
      closeButton={false}
    >
      <EtablissementItemContent etablissement={etablissement} />
    </Popup>
  );
};
