import { Divider, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { ApiType } from "shared";

import { api } from "@/api.client";

import { CfdInput } from "./CfdInput";
import { DispositifInput } from "./DispositifInput";
import { LibelleDiplomeInput } from "./LibelleDiplomeInput";

export const DiplomeSection = () => {
  const [cfdInfo, setCfdInfo] = useState<ApiType<typeof api.checkCfd>>();
  return (
    <>
      <Heading as="h2" fontSize="xl" mt="8">
        Diplôme concerné
      </Heading>
      <Divider pt="4" mb="4" />
      <CfdInput onCfdInfoChange={setCfdInfo} cfdInfo={cfdInfo} />
      <LibelleDiplomeInput cfdInfo={cfdInfo} />
      <DispositifInput cfdInfo={cfdInfo} />
    </>
  );
};
