import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
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
      <Box mb="6">
        <Heading color="bluefrance.113" fontSize="lg" mb="4">
          Capacité (2024)
        </Heading>
        <Flex maxW="500px">
          <FormControl
            flex={1}
            mr="4"
            isInvalid={!!errors.capaciteScolaire}
            isRequired
          >
            <FormLabel>Dont scolaire</FormLabel>
            <Input
              type="number"
              {...register("capaciteScolaire", {
                required: "La capacité scolaire est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
              })}
              placeholder="Capacité scolaire"
            />
            {errors.capaciteScolaire && (
              <FormErrorMessage>
                {errors.capaciteScolaire.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            flex={1}
            isInvalid={!!errors.capaciteApprentissage}
            isRequired
          >
            <FormLabel>Dont apprentissage</FormLabel>
            <Input
              type="number"
              {...register("capaciteApprentissage", {
                required: "La capacité apprentissage est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
              })}
              placeholder="Capacité apprentissage"
            />
            {errors.capaciteApprentissage && (
              <FormErrorMessage>
                {errors.capaciteApprentissage.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Flex>
      </Box>
    </>
  );
};
