import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

export const RentreeScolaireField = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms[2]>();

  return (
    <FormControl
      mb="6"
      maxW="500px"
      isInvalid={!!errors.rentreeScolaire}
      isRequired
    >
      <FormLabel>Rentrée scolaire</FormLabel>
      <Select
        bg="white"
        {...register("rentreeScolaire", {
          required: "La rentrée scolaire est obligatoire",
          setValueAs: (value) => parseInt(value) || undefined,
        })}
        placeholder="Sélectionner une option"
      >
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2023">2028</option>
      </Select>
      {errors.rentreeScolaire && (
        <FormErrorMessage>{errors.rentreeScolaire.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
