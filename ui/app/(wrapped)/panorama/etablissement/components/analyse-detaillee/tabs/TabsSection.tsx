import { Button, Img, Tab, TabList, Tabs } from "@chakra-ui/react";
export const TabsSection = ({
  displayType,
  displayDashboard,
  displayQuadrant,
}: {
  displayType: string;
  displayDashboard: () => void;
  displayQuadrant: () => void;
}) => {
  return (
    <Tabs
      isLazy={true}
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
          width="100%"
          minH={"54px"}
          color={"black"}
        >
          {displayType === "dashboard" ? (
            <Img src={`/icons/dashboard_selected.svg`} alt="" me={2} />
          ) : (
            <Img src={`/icons/dashboard.svg`} alt="" me={2} />
          )}
          Tableau de bord
        </Tab>
        <Tab
          as={Button}
          onClick={() => displayQuadrant()}
          width="100%"
          minH={"54px"}
          color={"black"}
        >
          {displayType === "quadrant" ? (
            <Img src={`/icons/quadrant_selected.svg`} alt="" me={2} />
          ) : (
            <Img src={`/icons/quadrant.svg`} alt="" me={2} />
          )}
          Quadrant des formations
        </Tab>
      </TabList>
    </Tabs>
  );
};
