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
    | "capaciteScolaireColoreeActuelle"
    | "capaciteScolaireColoree"
    | "capaciteApprentissageActuelle"
    | "capaciteApprentissage"
    | "capaciteApprentissageColoreeActuelle"
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
        control={control}
        render={({ field: { onChange, value, onBlur, ref, name } }) => {
          return (
            <NumberInput
              step={1}
              flex={1}
              isReadOnly={isReadOnly}
              onChange={(value) => onChange(value.replace(/\D/g, ""))}
              ref={ref}
              name={name}
              key={name}
              onBlur={onBlur}
              value={value}
              min={0}
              defaultValue={0}
              onFocus={(e) => e.currentTarget.select()}
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
