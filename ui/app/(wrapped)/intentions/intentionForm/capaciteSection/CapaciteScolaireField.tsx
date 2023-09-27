import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { safeParseInt } from "@/app/(wrapped)/intentions/utils/safeParseInt";

import {
  capaciteDoitEtreInferieure,
  capaciteDoitEtreSuperieure,
} from "../../utils/capaciteUtils";
import { isTypeFermeture, isTypeOuverture } from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteScolaireField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const typeDemande = watch("typeDemande");
    const capaciteActuelle = watch("capaciteScolaireActuelle");
    const doitEtreSuperieure = capaciteDoitEtreSuperieure(typeDemande);
    const doitEtreInferieure = capaciteDoitEtreInferieure(typeDemande);
    const ouverture = isTypeOuverture(typeDemande);
    const fermeture = isTypeFermeture(typeDemande);

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaire}
        isRequired
      >
        <FormLabel>
          {ouverture ? "Capacité prévisionnelle" : "Nouvelle capacité"}
        </FormLabel>
        <Input
          {...register("capaciteScolaire", {
            setValueAs: safeParseInt,
            validate: (value) => {
              if (value === undefined) return "Le champ est obligatoire";
              if (Number.isNaN(value))
                return "Veuillez remplir un nombre valide.";
              if (value < 0) return "Valeurs positives uniquement.";
              if (
                doitEtreSuperieure &&
                capaciteActuelle &&
                value <= capaciteActuelle
              )
                return "La future capacité prévisionnelle doit être supérieure à la capacité actuelle.";
              if (
                doitEtreInferieure &&
                capaciteActuelle &&
                value >= capaciteActuelle
              )
                return "La future capacité prévisionnelle doit être inférieure à la capacité actuelle.";
            },
          })}
          disabled={fermeture}
        />
        {errors.capaciteScolaire && (
          <FormErrorMessage>{errors.capaciteScolaire.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
