import {
  chakra,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { BESOINS_RH_LABELS } from "../../../../utils/besoinsRHUtils";

const getBesoinsRHOptions = () => {
  return Object.entries(BESOINS_RH_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
};

export const BesoinRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel>Sur le plan RH, identifiez-vous des besoins ?</FormLabel>
        <Controller
          name="besoinRH"
          shouldUnregister
          disabled={disabled}
          control={control}
          render={({
            field: { onChange, value, onBlur, ref, name, disabled },
          }) => {
            return (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]} ms={6}>
                  {getBesoinsRHOptions()?.map(({ value, label }) => (
                    <Checkbox
                      ref={ref}
                      disabled={disabled}
                      name={name}
                      isRequired={false}
                      key={value}
                      onBlur={onBlur}
                      value={value}
                      _checked={{ fontWeight: "bold !important" }}
                      fontWeight={"400 !important"}
                    >
                      {label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            );
          }}
        />
        {errors.besoinRH && (
          <FormErrorMessage>{errors.besoinRH?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
