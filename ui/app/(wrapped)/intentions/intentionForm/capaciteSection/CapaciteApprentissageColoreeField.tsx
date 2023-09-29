import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { safeParseInt } from "@/app/(wrapped)/intentions/utils/safeParseInt";
import { isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageColoreeField = chakra(
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
          setValue("capaciteApprentissageColoree", undefined);
        }).unsubscribe
    );

    const [coloration, typeDemande] = watch(["coloration", "typeDemande"]);
    const fermeture = isTypeFermeture(typeDemande);
    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteApprentissageColoree}
        isRequired
      >
        <FormLabel>Dont places colorées</FormLabel>
        <Input
          type="number"
          {...register("capaciteApprentissageColoree", {
            shouldUnregister: true,
            setValueAs: safeParseInt,
            value: null as unknown as undefined,
            validate: (value) => {
              if (value === undefined) return "Le champ est obligatoire";
              if (Number.isNaN(value))
                return "Veuillez remplir un nombre valide.";
              if (value < 0) return "Valeurs positives uniquement.";
            },
          })}
        />
        {errors.capaciteApprentissageColoree && (
          <FormErrorMessage>
            {errors.capaciteApprentissageColoree.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
