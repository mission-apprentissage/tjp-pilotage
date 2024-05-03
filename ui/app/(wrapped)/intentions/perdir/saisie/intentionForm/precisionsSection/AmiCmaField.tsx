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
import { isTypeDiminution } from "shared/demandeValidators/validators";

import { isTypeFermeture } from "../../../utils/typeDemandeUtils";
import { toBoolean } from "../../utils/toBoolean";
import { IntentionForms } from "../defaultFormValues";

export const AmiCmaField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const typeDemande = watch("typeDemande");

    const visible =
      !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);
    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.amiCma} isRequired>
        <FormLabel>AMI / CMA</FormLabel>
        <Controller
          name="amiCma"
          control={control}
          disabled={disabled}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
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
        {errors.amiCma && (
          <FormErrorMessage>{errors.amiCma?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
