import { Popup } from "react-map-gl/maplibre";

import { EtablissementItemContent } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/components/FormationSection/Tabs/EtablissementsTab/components/EtablissementItemContent";
import type { Etablissement } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

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
