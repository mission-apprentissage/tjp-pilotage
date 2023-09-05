import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

export const CapaciteSection = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms[2]>();

  return (
    <>
      <Heading as="h2" fontSize="xl" mt="8">
        Capacités prévisionnelles pour cette famille de métier
      </Heading>
      <Divider pt="4" mb="4" />
      <FormControl
        mb="4"
        maxW="500px"
        isInvalid={!!errors.rentreeScolaire}
        isRequired
      >
        <FormLabel>Rentrée scolaire</FormLabel>
        <Select
          bg="white"
          {...register("rentreeScolaire", {
            required: "La rentrée scolaire est obligatoire",
          })}
          placeholder="Sélectionner une option"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </Select>
        {errors.rentreeScolaire && (
          <FormErrorMessage>{errors.rentreeScolaire.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};
