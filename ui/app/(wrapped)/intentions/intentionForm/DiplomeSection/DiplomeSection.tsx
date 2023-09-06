import { Divider, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { ApiType } from "shared";

import { api } from "@/api.client";

import { DispositifInput } from "./DispositifInput";
import { SearchDiplomeInput } from "./SearchDiplomeInput";

export const DiplomeSection = ({
  formMetadata,
}: {
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const [dispositifs, setDispositifs] = useState<
    ApiType<typeof api.searchDiplome>[number]["dispositifs"] | undefined
  >(formMetadata?.dispositifs);

  return (
    <>
      <Heading as="h2" fontSize="xl" mt="8">
        Diplôme concerné
      </Heading>
      <Divider pt="4" mb="4" />
      <SearchDiplomeInput
        defaultLibelle={formMetadata?.libelleDiplome}
        setDispositifs={setDispositifs}
      />
      <DispositifInput options={dispositifs} />
    </>
  );
};
