import { Box, FormControl, FormLabel, LightMode } from "@chakra-ui/react";

import { client } from "@/api.client";

import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";

export const CfdBlock = ({
  metadata,
}: {
  metadata?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
}) => {
  return (
    <LightMode>
      <FormControl mb="4" isRequired w="100%" maxW="752px">
        <FormLabel>Recherche d'un diplôme</FormLabel>
        <Box color="chakra-body-text">
          <CfdAutocompleteInput
            name={"cfd"}
            inError={false}
            defaultValue={
              metadata?.formation?.libelleFormation
                ? {
                    value: "",
                    label: metadata?.formation?.libelleFormation,
                  }
                : undefined
            }
            active={false}
            onChange={(_selected) => {
              return null;
            }}
          />
        </Box>
      </FormControl>
    </LightMode>
  );
};
