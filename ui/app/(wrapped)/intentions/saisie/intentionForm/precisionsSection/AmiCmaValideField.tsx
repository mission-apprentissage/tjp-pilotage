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

import { toBoolean } from "../../utils/toBoolean";
import { IntentionForms } from "../defaultFormValues";

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
        <FormControl className={className} isInvalid={!!errors.amiCmaValide}>
          <FormLabel>Le financement est-il validé ?</FormLabel>
          {visible && (
            <Controller
              name="amiCmaValide"
              control={control}
              rules={{
                validate: (value) =>
                  typeof value === "boolean" || "Le champ est obligatoire",
              }}
              render={({ field: { onChange, value, onBlur, ref } }) => (
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
          )}
          {errors.amiCmaValide && (
            <FormErrorMessage>{errors.amiCmaValide?.message}</FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
