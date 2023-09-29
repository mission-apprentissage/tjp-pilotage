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

import { toBoolean } from "../../utils/toBoolean";

export const MixteField = chakra(({ className }: { className?: string }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl className={className} isInvalid={!!errors.mixte} isRequired>
      <FormLabel>S’agit-il d’une formation mixte ?</FormLabel>
      <Controller
        name="mixte"
        control={control}
        rules={{
          validate: (value) =>
            typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, value, ref } }) => (
          <RadioGroup
            as={Stack}
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
      {errors.mixte && (
        <FormErrorMessage>{errors.mixte?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
});
