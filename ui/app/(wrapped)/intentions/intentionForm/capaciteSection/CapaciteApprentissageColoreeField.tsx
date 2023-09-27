import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { capaciteDoitEtreInferieure } from "../../utils/capaciteUtils";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageColoreeField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const [coloration] = watch(["coloration"]);
    const typeDemande = watch("typeDemande");
    const capaciteApprentissageActuelle = watch(
      "capaciteApprentissageActuelle"
    );
    const capaciteApprentissage = watch("capaciteApprentissage");
    const doitEtreInferieure = capaciteDoitEtreInferieure(typeDemande);

    return (
      <>
        {coloration && (
          <FormControl
            className={className}
            isInvalid={!!errors.capaciteApprentissageColoree}
            isRequired
          >
            <FormLabel>Dont places colorées</FormLabel>
            <Input
              type="number"
              {...register("capaciteApprentissageColoree", {
                setValueAs: (value) => parseInt(value) || undefined,
                validate: (value) => {
                  if (value === undefined) return "Le champ est obligatoire";
                  if (Number.isNaN(value))
                    return "Veuillez remplir un nombre valide.";
                  if (value < 0) return "Valeurs positives uniquement.";
                  if (capaciteApprentissage && value > capaciteApprentissage)
                    return "Le nombre de places colorées ne peut être supérieur au nombre de places total.";
                  if (
                    doitEtreInferieure &&
                    capaciteApprentissageActuelle &&
                    value > capaciteApprentissageActuelle
                  )
                    return "Le nombre de places colorées fermées ne peut pas être supérieur au nombre de places actuelles.";
                },
              })}
            />
            {errors.capaciteApprentissageColoree && (
              <FormErrorMessage>
                {errors.capaciteApprentissageColoree.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
