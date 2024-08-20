import { FormControl, FormLabel, LightMode, Select } from "@chakra-ui/react";

import { client } from "@/api.client";

export const DispositifBlock = ({
  metadata,
}: {
  metadata?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
}) => {
  const dispositifs = metadata?.formation?.dispositifs;
  const dispositif = dispositifs && dispositifs[0];
  return (
    <LightMode>
      <FormControl mb="4" w="100%" maxW="752px" isRequired>
        <FormLabel>Dispositif</FormLabel>
        <Select
          name={"dispositif"}
          value={dispositif?.codeDispositif}
          bg={"white"}
          color="chakra-body-text"
          disabled={true}
          placeholder="Sélectionner une option"
        >
          <option value={dispositif?.codeDispositif}>
            {dispositif?.libelleDispositif}
          </option>
        </Select>
      </FormControl>
    </LightMode>
  );
};
