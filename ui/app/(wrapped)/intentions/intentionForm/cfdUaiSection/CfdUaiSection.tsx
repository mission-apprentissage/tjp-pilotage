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
  formId,
  active,
  formMetadata,
  onEditUaiCfdSection,
}: {
  formId?: string;
  active: boolean;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
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
          {formId ? `Demande n° ${formId}` : "Nouvelle demande"}
          <IconButton
            visibility={active ? "collapse" : "visible"}
            variant="ghost"
            ml="auto"
            aria-label="Editer"
            onClick={onEditUaiCfdSection}
          >
            <EditIcon />
          </IconButton>
        </Heading>
        <Divider pt="4" mb="4" />
        <CfdBlock
          formMetaData={formMetadata}
          setDispositifs={setDispositifs}
          active={active}
        />
        <DispositifBlock options={dispositifs} active={active} />
        <UaiBlock formMetadata={formMetadata} active={active} />
      </Box>
    </DarkMode>
  );
};
