import {
  chakra,
  FormControl,
  FormErrorMessage,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireColoreeField = chakra(
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
          setValue("capaciteScolaireColoree", 0);
        }).unsubscribe
    );

    const [coloration, typeDemande] = watch(["coloration", "typeDemande"]);
    const fermeture = isTypeFermeture(typeDemande);
    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaireColoree}
        isRequired
      >
        <Controller
          name="capaciteScolaireColoree"
          shouldUnregister
          control={control}
          rules={{
            required: "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => {
            return (
              <NumberInput
                step={1}
                flex={1}
                isReadOnly={disabled || fermeture || !coloration}
                onChange={onChange}
                ref={ref}
                name={name}
                isRequired={false}
                key={value}
                onBlur={onBlur}
                value={value}
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
                    opacity={disabled || fermeture || !coloration ? "0.3" : "1"}
                    cursor={
                      disabled || fermeture || !coloration
                        ? "not-allowed"
                        : "pointer"
                    }
                  />
                  <NumberDecrementStepper
                    opacity={disabled || fermeture || !coloration ? "0.3" : "1"}
                    cursor={
                      disabled || fermeture || !coloration
                        ? "not-allowed"
                        : "pointer"
                    }
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
        {errors.capaciteScolaireColoree && (
          <FormErrorMessage>
            {errors.capaciteScolaireColoree.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
