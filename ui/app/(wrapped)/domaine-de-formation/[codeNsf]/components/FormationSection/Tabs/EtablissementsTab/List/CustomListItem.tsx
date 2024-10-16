import { Divider, ListItem } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { EtablissementItemContent } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/components/FormationSection/Tabs/EtablissementsTab/components/EtablissementItemContent";
import type { Etablissement } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { themeDefinition } from "@/theme/theme";

export const CustomListItem = ({
  etablissement,
  activeUai,
  withDivider = true,
}: {
  etablissement: Etablissement;
  children?: React.ReactNode;
  activeUai: string;
  setActiveUai: (uai: string) => void;
  withDivider: boolean;
}) => {
  const trackEvent = usePlausible();

  const backgroundColor = (() => {
    if (activeUai === etablissement.uai) {
      return themeDefinition.colors.grey["1000_active"];
    }

    return "transparent";
  })();

  const onEtablissementHover = () => {
    trackEvent("cartographie-etablissement:interaction", {
      props: {
        type: "cartographie-etablissement-list-hover",
        uai: etablissement.uai,
      },
    });
  };

  const onEtablissementClick = () => {
    trackEvent("cartographie-etablissement:interaction", {
      props: {
        type: "cartographie-etablissement-list-click",
        uai: etablissement.uai,
      },
    });
  };

  return (
    <>
      <ListItem
        padding="16px"
        backgroundColor={backgroundColor}
        _hover={{ cursor: "pointer" }}
        onMouseEnter={() => onEtablissementHover()}
        onClick={() => onEtablissementClick()}
      >
        <EtablissementItemContent etablissement={etablissement} />
      </ListItem>
      {withDivider && <Divider />}
    </>
  );
};
