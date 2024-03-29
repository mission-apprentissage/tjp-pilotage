import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const AmiCmaValideAnneeField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("amiCmaValide");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={!!errors.amiCmaValideAnnee}
          isRequired
        >
          <FormLabel>En quelle année a t-il été validé ?</FormLabel>
          <NumberInput>
            <NumberInputField
              {...register("amiCmaValideAnnee", {
                shouldUnregister: true,
                disabled: disabled,
                setValueAs: (value) => value.toString(),
                validate: (value) => {
                  if (value === undefined) return "Le champ est obligatoire";
                  if (new RegExp(/^[0-9]{4}$/).test(value) === false)
                    return "Veuillez remplir une année valide.";
                },
              })}
            />
          </NumberInput>

          {errors.amiCmaValideAnnee && (
            <FormErrorMessage>
              {errors.amiCmaValideAnnee.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
