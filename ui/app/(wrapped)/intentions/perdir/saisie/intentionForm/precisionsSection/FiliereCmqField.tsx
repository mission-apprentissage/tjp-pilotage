import { chakra, Flex, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import { FiliereAutoCompleteInput } from "@/app/(wrapped)/intentions/perdir/saisie/components/FiliereAutoComplete";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const FiliereCmqField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    watch,
    control,
  } = useFormContext<IntentionForms>();

  const [typeDemande, cmqImplique] = watch(["typeDemande", "cmqImplique"]);

  const visible = cmqImplique && !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);
  if (!visible) return null;

  return (
    <Flex flex={1}>
      <FormControl className={className} isInvalid={!!errors.filiereCmq || !!errors.discipline2FormationRH}>
        <FormLabel>Précisez la filière d'activité du campus</FormLabel>
        <Flex direction={"row"} gap={2}>
          <Controller
            name="filiereCmq"
            control={control}
            rules={{ required: "Ce champ est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <FiliereAutoCompleteInput
                name={name}
                active={!disabled}
                inError={!!errors.filiereCmq}
                defaultValue={{ label: value, value: value ?? "" }}
                onChange={(v) => {
                  onChange(v?.value);
                }}
              />
            )}
          />
        </Flex>
        {errors.filiereCmq && <FormErrorMessage>{errors.filiereCmq.message}</FormErrorMessage>}
      </FormControl>
    </Flex>
  );
});
