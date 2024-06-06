import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const AmiCmaValideAnneeField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "amiCmaEnCoursValidation") return;
          setValue("amiCmaValideAnnee", undefined);
        }).unsubscribe
    );

    const [amiCma, amiCmaValide, amiCmaEnCoursValidation] = watch([
      "amiCma",
      "amiCmaValide",
      "amiCmaEnCoursValidation",
    ]);
    const visible = amiCma && amiCmaValide && !amiCmaEnCoursValidation;
    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.amiCmaValideAnnee}>
        <FormLabel>En quelle année a t-il été validé ?</FormLabel>
        <Input
          w="xs"
          bgColor={"white"}
          border={"1px solid"}
          {...register("amiCmaValideAnnee", {
            shouldUnregister: true,
            disabled: disabled,
            required:
              "Veuillez préciser l'année de validation de votre financement AMI/CMA",
            validate: (value) => {
              if (value === undefined)
                return "Veuillez préciser l'année de validation de votre financement AMI/CMA";
              if (new RegExp(/^\d{4}$/).test(value) === false)
                return "Veuillez remplir une année valide.";
            },
          })}
        />
        {errors.amiCmaValideAnnee && (
          <FormErrorMessage>
            {errors.amiCmaValideAnnee.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
