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

import { isTypeFermeture, isTypeOuverture } from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageField = chakra(
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
          setValue("capaciteApprentissage", undefined);
        }).unsubscribe
    );

    const [typeDemande, motif] = watch(["typeDemande", "motif"]);
    const ouverture = isTypeOuverture(typeDemande);
    const fermeture = isTypeFermeture(typeDemande);
    const isTransfertApprentissage = motif.includes("transfert_apprentissage");
    if (fermeture && !isTransfertApprentissage) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteApprentissage}
        isRequired
      >
        <FormLabel>
          {ouverture ? "Capacité prévisionnelle" : "Nouvelle capacité"}
        </FormLabel>
        <Input
          type="number"
          {...register("capaciteApprentissage", {
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
        {errors.capaciteApprentissage && (
          <FormErrorMessage>
            {errors.capaciteApprentissage.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
