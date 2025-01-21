import { Button, Flex, Img, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
export const TabsSection = ({
  displayType,
  displayDashboard,
  displayQuadrant,
}: {
  displayType: string;
  displayDashboard: () => void;
  displayQuadrant: () => void;
}) => {
  const getTabIndex = () => {
    if (displayType === "dashboard") return 0;
    if (displayType === "quadrant") return 1;
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
          onClick={() => displayDashboard()}
          color={"black"}
          h={"102px"}
          w={"300px"}
          _hover={{ bg: "bluefrance.975_hover" }}
          bg={"bluefrance.975"}
        >
          <Flex direction={"column"} justify={"center"} alignItems={"center"} mx={"80px"}>
            {displayType === "dashboard" ? (
              <Img src={`/icons/dashboard_selected.svg`} alt="Icône onglet tableau de bord sélectionné" w={"32px"} h={"32px"} />
            ) : (
              <Img src={`/icons/dashboard.svg`} alt="Icône onglet tableau de bord" w={"32px"} h={"32px"} />
            )}
            <Text>Tableau de bord</Text>
          </Flex>
        </Tab>
        <Tab
          as={Button}
          onClick={() => displayQuadrant()}
          color={"black"}
          p={"24px 32px"}
          h={"102px"}
          bg={"bluefrance.975"}
          _hover={{ bg: "bluefrance.975_hover" }}
          w={"300px"}
        >
          <Flex direction={"column"} justify={"center"} alignItems={"center"}>
            {displayType === "quadrant" ? (
              <Img src={`/icons/quadrant_selected.svg`} alt="Icône onglet quadrant sélectionné" w={"32px"} h={"32px"} />
            ) : (
              <Img src={`/icons/quadrant.svg`} alt="Icône onglet quadrant" w={"32px"} h={"32px"} />
            )}
            <Text>Quadrant des formations</Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};
