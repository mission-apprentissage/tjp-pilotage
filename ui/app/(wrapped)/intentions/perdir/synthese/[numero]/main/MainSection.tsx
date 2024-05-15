import { Flex } from "@chakra-ui/react";

import { DisplayTypeEnum } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/main/displayTypeEnum";

import { TabsSection } from "./TabsSection";

export const MainSection = ({
  displayType,
  displaySynthese,
  displayCommentairesEtAvis,
}: {
  displayType: DisplayTypeEnum;
  displaySynthese: () => void;
  displayCommentairesEtAvis: () => void;
}) => {
  return (
    <Flex bg="white" borderRadius={6} p={6}>
      <TabsSection
        displayType={displayType}
        displaySynthese={displaySynthese}
        displayCommentairesEtAvis={displayCommentairesEtAvis}
      />
    </Flex>
  );
};
