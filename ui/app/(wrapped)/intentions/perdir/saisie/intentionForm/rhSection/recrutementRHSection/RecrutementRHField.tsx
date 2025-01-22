import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { toBoolean } from "@/utils/toBoolean";

export const RecrutementRHField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl as="fieldset" className={className} isInvalid={!!errors.recrutementRH} isRequired>
      <FormLabel as="legend">Des recrutements ?</FormLabel>
      <Controller
        name="recrutementRH"
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
      {errors.recrutementRH && <FormErrorMessage>{errors.recrutementRH?.message}</FormErrorMessage>}
    </FormControl>
  );
});
