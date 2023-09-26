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
                  if (Number.isNaN(value))
                    return "Veuillez remplir un nombre valide.";
                  if (value && value < 0)
                    return "Valeurs positives uniquement.";
                  if (
                    capaciteApprentissage &&
                    value &&
                    value > capaciteApprentissage
                  )
                    return "Le nombre de places colorées ne peut être supérieur au nombre de places total.";
                  if (
                    doitEtreInferieure &&
                    capaciteApprentissageActuelle &&
                    value &&
                    value > capaciteApprentissageActuelle
                  )
                    return "Le nombre de places colorées fermées ne peuvent pas être supérieures au nombre de places actuelles.";
                },
              })}
              placeholder="0"
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
