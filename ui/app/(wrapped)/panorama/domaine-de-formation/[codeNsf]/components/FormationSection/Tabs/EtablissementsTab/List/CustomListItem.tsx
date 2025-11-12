import { Divider, ListItem } from "@chakra-ui/react";

import { EtablissementItemContent } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/components/FormationSection/Tabs/EtablissementsTab/components/EtablissementItemContent";
import type { Etablissement } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";

export const CustomListItem = ({
  etablissement,
  withDivider = true,
}: {
  etablissement: Etablissement;
  withDivider: boolean;
}) => {
  const backgroundColor = (() => {
    return "transparent";
  })();
  return (
    <>
      <ListItem
        padding="16px"
        backgroundColor={backgroundColor}
        _hover={{ cursor: "pointer" }}
      >
        <EtablissementItemContent etablissement={etablissement} />
      </ListItem>
      {withDivider && <Divider />}
    </>
  );
};
