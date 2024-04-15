import {
  chakra,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { isTypeOuverture } from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireActuelleField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      setValue,
      control,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaireActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    const isReadOnly = disabled || ouverture;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaireActuelle}
      >
        <Controller
          name="capaciteScolaireActuelle"
          shouldUnregister
          control={control}
          render={({ field: { onChange, value, onBlur, ref, name } }) => (
            <NumberInput
              step={1}
              flex={1}
              isReadOnly={isReadOnly}
              onChange={onChange}
              ref={ref}
              name={name}
              key={value}
              onBlur={onBlur}
              value={value}
              min={0}
              defaultValue={0}
            >
              <NumberInputField
                textAlign={"end"}
                fontSize={"16px"}
                fontWeight={700}
                borderWidth={"1px"}
                borderColor={"gray.200"}
                borderRadius={4}
                _readOnly={{
                  opacity: "0.5",
                  cursor: "not-allowed",
                }}
                py={6}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  opacity={isReadOnly ? "0.3" : "1"}
                  cursor={isReadOnly ? "not-allowed" : "pointer"}
                />
                <NumberDecrementStepper
                  opacity={isReadOnly ? "0.3" : "1"}
                  cursor={isReadOnly ? "not-allowed" : "pointer"}
                  _disabled={{
                    opacity: "0.3",
                    cursor: "not-allowed",
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
      </FormControl>
    );
  }
);
