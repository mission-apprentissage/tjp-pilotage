"use client";

import { HStack } from "@chakra-ui/react";

import { GuardPermission } from "../../../../../utils/security/GuardPermission";
import { Map as MAPLIBRE } from "./components/Map_MAPLIBRE";

export default function MapExperimentation() {
  return (
    <GuardPermission permission="investigations">
      <HStack>
        <MAPLIBRE />
      </HStack>
    </GuardPermission>
  );
}
