import { Box, Divider, Select, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { AutreMotifRefusField } from "./AutreMotifRefusField";
import { MotifRefusBlock } from "./MotifRefusBlock";
export const StatusBlock = ({ disabled }: { disabled: boolean }) => {
  const { control } = useFormContext<IntentionForms>();

  return (
    <Box bg="white" p="6" mt="6" borderRadius={6}>
      <Text fontSize={20} mb={4} fontWeight={700}>
        Statut de la demande
      </Text>
      <Divider mb={4} />
      <Controller
        name="statut"
        control={control}
        rules={{ required: "Le type de demande est obligatoire." }}
        render={({ field: { onChange, name, value } }) => (
          <Select w="xs" onChange={onChange} name={name} value={value}>
            <option value="draft">Projet de demande</option>
            <option value="submitted">Validée</option>
            <option value="refused">Refusée</option>
          </Select>
        )}
      />
      <MotifRefusBlock disabled={disabled} mb="6" mt={6} />
      <AutreMotifRefusField disabled={disabled} mb="6" maxW="752px" />
    </Box>
  );
};
