import { Divider, ListItem } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { EtablissementItemContent } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/components/FormationSection/Tabs/EtablissementsTab/components/EtablissementItemContent";
import type { Etablissement } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";

export const CustomListItem = ({
  etablissement,
  withDivider = true,
}: {
  etablissement: Etablissement;
  withDivider: boolean;
}) => {
  const trackEvent = usePlausible();

  const backgroundColor = (() => {
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
