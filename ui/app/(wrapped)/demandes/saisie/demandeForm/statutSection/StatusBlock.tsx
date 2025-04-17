import { Divider, Flex, Select, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

import { AutreMotifRefusField } from "./AutreMotifRefusField";
import { MotifRefusBlock } from "./MotifRefusBlock";

export const StatusBlock = ({ disabled }: { disabled: boolean }) => {
  const { control } = useFormContext<DemandeFormType>();

  return (
    <Flex direction="column">
      <Text as="label" htmlFor="select-statut" fontSize={20} mb={4} fontWeight={700}>
        Statut de la demande
      </Text>
      <Divider mb={4} />
      <Controller
        name="statut"
        control={control}
        rules={{ required: "Le type de demande est obligatoire." }}
        render={({ field: { onChange, name, value } }) => (
          <Select id="select-statut" w="xs" onChange={onChange} name={name} value={value} disabled={disabled}>
            <option value={DemandeStatutEnum["projet de demande"]}>Projet de demande</option>
            <option value={DemandeStatutEnum["demande validée"]}>Validée</option>
            <option value={DemandeStatutEnum["refusée"]}>Refusée</option>
          </Select>
        )}
      />
      <MotifRefusBlock disabled={disabled} my={6} />
      <AutreMotifRefusField disabled={disabled} my={6} />
    </Flex>
  );
};
