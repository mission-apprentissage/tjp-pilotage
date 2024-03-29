import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { toBoolean } from "../../utils/toBoolean";

export const AmiCmaValideField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("amiCma");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={!!errors.amiCmaValide}
          isRequired
        >
          <FormLabel>Le financement est-il validé</FormLabel>
          <Controller
            name="amiCmaValide"
            control={control}
            disabled={disabled}
            rules={{
              validate: (value) =>
                typeof value === "boolean" || "Le champ est obligatoire",
            }}
            render={({ field: { onChange, value, onBlur, ref, disabled } }) => (
              <RadioGroup
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
          {errors.amiCmaValide && (
            <FormErrorMessage>{errors.amiCmaValide?.message}</FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
