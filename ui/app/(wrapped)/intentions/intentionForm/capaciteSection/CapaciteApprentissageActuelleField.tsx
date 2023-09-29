import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { safeParseInt } from "../../utils/safeParseInt";
import { isTypeOuverture } from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageActuelleField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageActuelle", undefined);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    if (ouverture) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteApprentissageActuelle}
        isRequired
      >
        <FormLabel>Capacité actuelle</FormLabel>
        <Input
          type="number"
          {...register("capaciteApprentissageActuelle", {
            shouldUnregister: true,
            setValueAs: safeParseInt,
            value: null as unknown as undefined,
            validate: (value) => {
              if (value === undefined) return "Le champ est obligatoire";
              if (Number.isNaN(value))
                return "Veuillez remplir un nombre valide.";
              if (value < 0) return "Valeurs positives uniquement.";
              return;
            },
          })}
        />
        {errors.capaciteApprentissageActuelle && (
          <FormErrorMessage>
            {errors.capaciteApprentissageActuelle.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
