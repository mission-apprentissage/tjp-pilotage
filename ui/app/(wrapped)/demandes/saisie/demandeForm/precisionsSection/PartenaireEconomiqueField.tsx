import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { isTypeDiminution, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { toBoolean } from "@/utils/toBoolean";

export const PartenaireEconomiqueField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<DemandeFormType>();

    const typeDemande = watch("typeDemande");
    const visible = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

    if (!visible) return null;

    return (
      <FormControl as="fieldset" className={className} isInvalid={!!errors.partenairesEconomiquesImpliques} isRequired>
        <FormLabel as="legend">Des partenaires économiques sont-ils impliqués ?</FormLabel>
        <Controller
          name="partenairesEconomiquesImpliques"
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
        {errors.partenairesEconomiquesImpliques && (
          <FormErrorMessage>{errors.partenairesEconomiquesImpliques?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
