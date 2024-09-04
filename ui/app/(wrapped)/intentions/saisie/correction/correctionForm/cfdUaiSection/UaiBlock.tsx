import { Box, FormControl, FormLabel, LightMode } from "@chakra-ui/react";

import { client } from "@/api.client";

import { UaiAutocomplete } from "../../components/UaiAutocomplete";

export const UaiBlock = ({
  metadata,
}: {
  metadata?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
}) => {
  return (
    <LightMode>
      <FormControl mb="auto" isRequired>
        <FormLabel>Recherche d'un établissement</FormLabel>
        <Box color="chakra-body-text">
          <UaiAutocomplete
            name={"uai"}
            active={false}
            inError={false}
            defaultValue={
              metadata?.etablissement?.libelleEtablissement
                ? {
                    label: metadata?.etablissement.libelleEtablissement,
                    value: "",
                    commune: metadata?.etablissement.commune,
                  }
                : undefined
            }
            onChange={(_v) => {
              return null;
            }}
          />
        </Box>
      </FormControl>
    </LightMode>
  );
};
