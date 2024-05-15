import { Button, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { DisplayTypeEnum } from "./displayTypeEnum";
export const TabsSection = ({
  displayType,
  displaySynthese,
  displayCommentairesEtAvis,
}: {
  displayType: DisplayTypeEnum;
  displaySynthese: () => void;
  displayCommentairesEtAvis: () => void;
}) => {
  const getTabIndex = () => {
    if (displayType === DisplayTypeEnum.synthese) return 0;
    if (displayType === DisplayTypeEnum.commentairesEtAvis) return 1;
  };
  return (
    <Tabs
      isLazy={true}
      index={getTabIndex()}
      display="flex"
      flex="1"
      flexDirection="column"
      variant="enclosed-colored"
      minHeight="0"
      width={"100%"}
    >
      <TabList>
        <Tab
          as={Button}
          onClick={() => displaySynthese()}
          color={"black"}
          h={"40px"}
          w={"fit-content"}
          _hover={{ bg: "bluefrance.975_hover" }}
          bg={"bluefrance.975"}
        >
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:article-line" />
            <Text>Synthèse</Text>
          </Flex>
        </Tab>
        <Tab
          as={Button}
          onClick={() => displayCommentairesEtAvis()}
          color={"black"}
          h={"40px"}
          w={"fit-content"}
          bg={"bluefrance.975"}
          _hover={{ bg: "bluefrance.975_hover" }}
        >
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:team-line" />
            <Text>Commentaires et avis</Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};
