import { chakra, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeDiminution,isTypeFermeture } from "shared/utils/typeDemandeUtils";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const AmiCmaValideAnneeField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<DemandeFormType>();

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "amiCmaEnCoursValidation" && name !== "amiCma") return;
        setValue("amiCmaValideAnnee", undefined);
      }).unsubscribe
  );

  const [typeDemande, amiCma, amiCmaValide, amiCmaEnCoursValidation] = watch([
    "typeDemande",
    "amiCma",
    "amiCmaValide",
    "amiCmaEnCoursValidation",
  ]);
  const visible =
    !isTypeFermeture(typeDemande) &&
    !isTypeDiminution(typeDemande) &&
    amiCma &&
    amiCmaValide &&
    !amiCmaEnCoursValidation;
  if (!visible) return null;

  return (
    <FormControl className={className} isInvalid={!!errors.amiCmaValideAnnee}>
      <FormLabel>En quelle année a t-il été validé ?</FormLabel>
      <Input
        w="xs"
        bgColor={"white"}
        border={"1px solid"}
        {...register("amiCmaValideAnnee", {
          disabled: disabled,
          required: "Veuillez préciser l'année de validation de votre financement AMI/CMA",
          validate: (value) => {
            if (value === undefined) return "Veuillez préciser l'année de validation de votre financement AMI/CMA";
            if (new RegExp(/^\d{4}$/).test(value) === false) return "Veuillez remplir une année valide.";
          },
        })}
      />
      {errors.amiCmaValideAnnee && <FormErrorMessage>{errors.amiCmaValideAnnee.message}</FormErrorMessage>}
    </FormControl>
  );
});
