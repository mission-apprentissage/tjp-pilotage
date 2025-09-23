import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { toBoolean } from "@/utils/toBoolean";

export const ReconversionRHField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<DemandeFormType>();

  return (
    <FormControl as="fieldset" className={className} isInvalid={!!errors.reconversionRH} isRequired>
      <FormLabel as="legend">Des reconversions ?</FormLabel>
      <Controller
        name="reconversionRH"
        control={control}
        render={({ field: { onChange, value, onBlur, ref } }) => (
          <RadioGroup
            ms={6}
            as={Stack}
            onBlur={onBlur}
            onChange={(v) => onChange(toBoolean(v))}
            value={JSON.stringify(value)}
            defaultValue="false"
          >
            <Radio
              ref={ref}
              value="true"
              isReadOnly={disabled}
              isDisabled={disabled}
            >
              Oui
            </Radio>
            <Radio
              ref={ref}
              value="false"
              isReadOnly={disabled}
              isDisabled={disabled}
            >
              Non
            </Radio>
          </RadioGroup>
        )}
      />
      {errors.reconversionRH && <FormErrorMessage>{errors.reconversionRH?.message}</FormErrorMessage>}
    </FormControl>
  );
});
