import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { toBoolean } from "@/utils/toBoolean";

export const TravauxAmenagementField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl className={className} isInvalid={!!errors.travauxAmenagement} isRequired>
      <FormLabel>Votre proposition implique-t-elle des travaux d'aménagement ?</FormLabel>
      <Controller
        name="travauxAmenagement"
        control={control}
        disabled={disabled}
        rules={{
          validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, value, onBlur, ref, disabled } }) => (
          <RadioGroup
            ms={6}
            isDisabled={disabled}
            as={Stack}
            onBlur={onBlur}
            onChange={(v) => onChange(toBoolean(v))}
            value={JSON.stringify(value)}
          >
            <Radio ref={ref} value="true">
              Oui
            </Radio>
            <Radio ref={ref} value="false">
              Non
            </Radio>
          </RadioGroup>
        )}
      />
      {errors.travauxAmenagement && <FormErrorMessage>{errors.travauxAmenagement?.message}</FormErrorMessage>}
    </FormControl>
  );
});
