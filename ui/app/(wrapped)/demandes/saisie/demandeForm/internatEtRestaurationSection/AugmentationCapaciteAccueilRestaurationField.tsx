import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { toBoolean } from "@/utils/toBoolean";

export const AugmentationCapaciteAccueilRestaurationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<DemandeFormType>();

    return (
      <FormControl as="fieldset" className={className} isInvalid={!!errors.augmentationCapaciteAccueilRestauration} isRequired>
        <FormLabel as="legend">
          Votre proposition est-elle susceptible d'augmenter les capacités d'accueil du service de restauration ?
        </FormLabel>
        <Controller
          name="augmentationCapaciteAccueilRestauration"
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
        {errors.augmentationCapaciteAccueilRestauration && (
          <FormErrorMessage>{errors.augmentationCapaciteAccueilRestauration?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
