import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { Campagne } from "../../types";
import { IntentionForms } from "../defaultFormValues";

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

  const rentreeScolaireOptions = [1, 2, 3, 4, 5].map(
    (offsetRentree: number) =>
      parseInt(campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE) + offsetRentree
  );

  return (
    <FormControl
      className={className}
      isInvalid={!!errors.rentreeScolaire}
      isRequired
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
          {rentreeScolaireOptions.map((rentreeScolaireOption) => (
            <option key={rentreeScolaireOption} value={rentreeScolaireOption}>
              {rentreeScolaireOption}
            </option>
          ))}
        </Select>
      </Tooltip>
      {errors.rentreeScolaire && (
        <FormErrorMessage>{errors.rentreeScolaire.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
