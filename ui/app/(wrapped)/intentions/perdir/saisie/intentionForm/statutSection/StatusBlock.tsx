import { Divider, Flex, Select, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { formatStatut } from "../../../../utils/statutUtils";
import { AutreMotifRefusField } from "./AutreMotifRefusField";
import { MotifRefusBlock } from "./MotifRefusBlock";
export const StatusBlock = ({ disabled }: { disabled: boolean }) => {
  const { control } = useFormContext<IntentionForms>();

  return (
    <Flex direction="column">
      <Text fontSize={20} mb={4} fontWeight={700}>
        Statut de la demande
      </Text>
      <Divider mb={4} />
      <Controller
        name="statut"
        control={control}
        rules={{ required: "Le type de demande est obligatoire." }}
        render={({ field: { onChange, name, value } }) => (
          <Select
            w="xs"
            onChange={onChange}
            name={name}
            value={value}
            disabled={disabled}
          >
            <option value={DemandeStatutEnum["brouillon"]}>
              {formatStatut(DemandeStatutEnum["brouillon"])}
            </option>
            <option value={DemandeStatutEnum["proposition"]}>
              {formatStatut(DemandeStatutEnum["proposition"])}
            </option>
            <option value={DemandeStatutEnum["demande validée"]}>
              {formatStatut(DemandeStatutEnum["demande validée"])}
            </option>
            <option value={DemandeStatutEnum["refusée"]}>
              {formatStatut(DemandeStatutEnum["refusée"])}
            </option>
          </Select>
        )}
      />
      <MotifRefusBlock disabled={disabled} my={6} />
      <AutreMotifRefusField disabled={disabled} mb="6" />
    </Flex>
  );
};
