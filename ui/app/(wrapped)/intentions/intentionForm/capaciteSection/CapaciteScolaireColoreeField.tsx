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

export const CapaciteScolaireColoreeField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const [coloration] = watch(["coloration"]);
    const [typeDemande, capaciteScolaireActuelle, capaciteScolaire] = watch([
      "typeDemande",
      "capaciteScolaireActuelle",
      "capaciteScolaire",
    ]);
    const doitEtreInferieure = capaciteDoitEtreInferieure(typeDemande);

    return (
      <>
        {coloration && (
          <FormControl
            className={className}
            isInvalid={!!errors.capaciteScolaireColoree}
            isRequired
          >
            <FormLabel>Dont places colorées</FormLabel>
            <Input
              type="number"
              {...register("capaciteScolaireColoree", {
                required: "Le champ est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
                validate: (value) => {
                  if (Number.isNaN(value))
                    return "Veuillez remplir un nombre valide.";
                  if (value && value < 0)
                    return "Valeurs positives uniquement.";
                  if (capaciteScolaire && value && value > capaciteScolaire)
                    return "Le nombre de places colorées ne peut être supérieur au nombre de places total.";
                  if (
                    doitEtreInferieure &&
                    capaciteScolaireActuelle &&
                    value &&
                    value > capaciteScolaireActuelle
                  )
                    return "Le nombre de places colorées fermées ne peut pas être supérieur au nombre de places actuelles.";
                },
              })}
            />
            {errors.capaciteScolaireColoree && (
              <FormErrorMessage>
                {errors.capaciteScolaireColoree.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
