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
import { isTypeFermeture } from "@/app/(wrapped)/utils/typeDemandeUtils";

import { IntentionForms } from "../defaultFormValues";

export const CapaciteScolaireColoreeField = chakra(
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
          if (name !== "typeDemande") return;
          setValue("capaciteScolaireColoree", undefined);
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
        <FormLabel>Dont places colorées</FormLabel>
        <Input
          type="number"
          {...register("capaciteScolaireColoree", {
            shouldUnregister: true,
            disabled,
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
        {errors.capaciteScolaireColoree && (
          <FormErrorMessage>
            {errors.capaciteScolaireColoree.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
