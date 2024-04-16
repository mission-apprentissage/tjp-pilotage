import {
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "../intentionForm/defaultFormValues";
export const CapaciteField = ({
  name,
  className,
  isReadOnly,
}: {
  name:
    | "capaciteScolaireActuelle"
    | "capaciteScolaire"
    | "capaciteScolaireColoree"
    | "capaciteApprentissageActuelle"
    | "capaciteApprentissage"
    | "capaciteApprentissageColoree";
  className?: string;
  isReadOnly: boolean;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl className={className} isInvalid={!!errors[name]}>
      <Controller
        name={name}
        shouldUnregister
        control={control}
        render={({ field: { onChange, value, onBlur, ref, name } }) => {
          return (
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
                  pointerEvents: "none",
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
          );
        }}
      />
    </FormControl>
  );
};
