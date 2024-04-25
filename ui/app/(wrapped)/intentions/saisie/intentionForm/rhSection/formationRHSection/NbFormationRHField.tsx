import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "../../defaultFormValues";

export const NbFormationRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("formationRH");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl className={className} isInvalid={!!errors.nbFormationRH}>
          <FormLabel>Combien de formations ?</FormLabel>
          {visible && (
            <Controller
              name="nbFormationRH"
              shouldUnregister
              control={control}
              rules={{
                required: "Le champ est obligatoire",
              }}
              render={({ field: { onChange, value, onBlur, ref, name } }) => (
                <NumberInput
                  step={1}
                  flex={1}
                  isReadOnly={disabled}
                  onChange={onChange}
                  ref={ref}
                  name={name}
                  isRequired={false}
                  key={name}
                  onBlur={onBlur}
                  value={value}
                  min={0}
                  defaultValue={0}
                  size={"md"}
                  w={56}
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
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      opacity={disabled ? "0.3" : "1"}
                      cursor={disabled ? "not-allowed" : "pointer"}
                    />
                    <NumberDecrementStepper
                      opacity={disabled ? "0.3" : "1"}
                      cursor={disabled ? "not-allowed" : "pointer"}
                      _disabled={{
                        opacity: "0.3",
                        cursor: "not-allowed",
                      }}
                    />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
          )}
          {errors.nbFormationRH && (
            <FormErrorMessage>{errors.nbFormationRH.message}</FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
