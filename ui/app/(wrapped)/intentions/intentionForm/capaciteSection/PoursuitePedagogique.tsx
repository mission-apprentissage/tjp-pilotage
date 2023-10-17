import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";
import { isTypeFermeture } from "@/app/(wrapped)/utils/typeDemandeUtils";

import { toBoolean } from "../../utils/toBoolean";

export const PoursuitePedagogiqueField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    if (fermeture) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.poursuitePedagogique}
        isRequired
      >
        <FormLabel>Poursuite pédagogique pour ce diplôme</FormLabel>
        <Controller
          name="poursuitePedagogique"
          shouldUnregister
          control={control}
          disabled={disabled}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, ref, onBlur, disabled } }) => (
            <RadioGroup
              as={Stack}
              onBlur={onBlur}
              onChange={(v) => onChange(toBoolean(v))}
              value={JSON.stringify(value)}
              isDisabled={disabled}
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
        {errors.poursuitePedagogique && (
          <FormErrorMessage>
            {errors.poursuitePedagogique?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
