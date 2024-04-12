import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { Campagne } from "../../types";

export const RentreeScolaireField = ({
  disabled,
  className,
  campagne,
}: {
  disabled?: boolean;
  className?: string;
  campagne?: Campagne;
}) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms>();

  return (
    <FormControl
      className={className}
      isInvalid={!!errors.rentreeScolaire}
      isRequired
      maxW="752px"
    >
      <FormLabel>Rentrée scolaire</FormLabel>
      <Tooltip
        label={
          disabled
            ? "Pour modifier la rentrée scolaire d'une demande veuillez refuser celle-ci et en créer une autre."
            : ""
        }
      >
        <Select
          bg="white"
          {...register("rentreeScolaire", {
            required: "La rentrée scolaire est obligatoire",
            setValueAs: (value) => parseInt(value) || undefined,
          })}
          placeholder="Sélectionner une option"
          disabled={disabled}
          isInvalid={!!errors.rentreeScolaire}
        >
          {campagne && campagne?.annee != "2024" && (
            <option value="2024">2024</option>
          )}
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2023">2028</option>
        </Select>
      </Tooltip>
      {errors.rentreeScolaire && (
        <FormErrorMessage>{errors.rentreeScolaire.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
