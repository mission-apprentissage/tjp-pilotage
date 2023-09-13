import { EditIcon } from "@chakra-ui/icons";
import { Box, DarkMode, Divider, Heading, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { ApiType } from "shared";

import { api } from "@/api.client";

import { PartialIntentionForms } from "../defaultFormValues";
import { CfdBlock } from "./CfdBlock";
import { DispositifBlock } from "./DispositifBlock";
import { UaiBlock } from "./UaiBlock";

export const CfdUaiSection = ({
  active,
  defaultValues,
  formMetadata,
  submitCfdUai,
  onEditUaiCfdSection,
}: {
  active: boolean;
  defaultValues: PartialIntentionForms[1];
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  submitCfdUai: (values: PartialIntentionForms[1]) => void;
  onEditUaiCfdSection: () => void;
}) => {
  const [dispositifs, setDispositifs] = useState<
    ApiType<typeof api.searchDiplome>[number]["dispositifs"] | undefined
  >(formMetadata?.formation?.dispositifs);

  return (
    <DarkMode>
      <Box
        color="chakra-body-text"
        as="form"
        bg="#5770BE"
        p="6"
        borderRadius="6"
      >
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          Nouvelle demande
          <IconButton
            visibility={active ? "collapse" : "visible"}
            variant="ghost"
            ml="auto"
            aria-label="Editer"
            onClick={onEditUaiCfdSection}
          >
            Modifier
            <EditIcon />
          </IconButton>
        </Heading>
        <Divider pt="4" mb="4" />
        <CfdBlock
          defaultDiplome={formMetadata?.formation}
          defaultValues={defaultValues}
          setDispositifs={setDispositifs}
          onSubmit={submitCfdUai}
          active={active}
        />
        <DispositifBlock
          options={dispositifs}
          defaultValues={defaultValues}
          onSubmit={submitCfdUai}
          active={active}
        />
        <UaiBlock
          defaultEtablissement={formMetadata?.etablissement}
          defaultValues={defaultValues}
          onSubmit={submitCfdUai}
          active={active}
        />
      </Box>
    </DarkMode>
  );
};
