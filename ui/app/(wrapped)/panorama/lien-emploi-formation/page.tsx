"use client";

import { VStack } from "@chakra-ui/react";
import { useState } from "react";

import { DashboardFormation } from "./components/DashboardFormation/Dashboard";
import { DashboardMetier } from "./components/DashboardMetier/Dashboard";
import { DisplayTypeEnum } from "./components/displayTypeEnum";
import { TabsSection } from "./components/TabsSection";

const LienEmploiFormation = () => {
  const [displayType, setDisplayType] = useState<DisplayTypeEnum>(
    DisplayTypeEnum.formation
  );

  return (
    <VStack gap="12px" py="16px" alignItems="start" width="100%">
      <TabsSection displayType={displayType} setDisplayType={setDisplayType} />
      {displayType === DisplayTypeEnum.formation && <DashboardFormation />}
      {displayType === DisplayTypeEnum.metier && <DashboardMetier />}
    </VStack>
  );
};

export default LienEmploiFormation;
