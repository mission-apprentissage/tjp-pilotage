import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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

    const visible = watch("amiCmaValide") && watch("amiCma");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={!!errors.amiCmaValideAnnee}
        >
          <FormLabel>En quelle année a t-il été validé ?</FormLabel>
          {visible && (
            <Input
              w="xs"
              {...register("amiCmaValideAnnee", {
                shouldUnregister: true,
                disabled: disabled,
                required:
                  "Veuillez préciser l'année de validation de votre financement AMI/CMA",
                validate: (value) => {
                  if (value === undefined)
                    return "Veuillez préciser l'année de validation de votre financement AMI/CMA";
                  if (new RegExp(/^[0-9]{4}$/).test(value) === false)
                    return "Veuillez remplir une année valide.";
                },
              })}
            />
          )}

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