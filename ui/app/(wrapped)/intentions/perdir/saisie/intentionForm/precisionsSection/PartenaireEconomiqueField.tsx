import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { toBoolean } from "@/utils/toBoolean";

export const PartenaireEconomiqueField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const typeDemande = watch("typeDemande");
    const visible = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.partenairesEconomiquesImpliques} isRequired>
        <FormLabel>Des partenaires économiques sont-ils impliqués ?</FormLabel>
        <Controller
          name="partenairesEconomiquesImpliques"
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
        {errors.partenairesEconomiquesImpliques && (
          <FormErrorMessage>{errors.partenairesEconomiquesImpliques?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  },
);
