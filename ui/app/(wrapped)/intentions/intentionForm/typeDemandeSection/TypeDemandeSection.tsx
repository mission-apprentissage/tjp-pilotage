import { Divider, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { MotifField } from "@/app/(wrapped)/intentions/intentionForm/typeDemandeSection/MotifField";

import { RentreeScolaireField } from "../capaciteSection/RentreeScolaireField";
import { IntentionForms } from "../defaultFormValues";
import { AutreMotif } from "./AutreMotifField";

export const TypeDemandeSection = () => {
  const { watch } = useFormContext<IntentionForms[2]>();

  const [typeDemande] = watch(["typeDemande"]);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <RentreeScolaireField />

      {typeDemande === "ouverture_compensation" && (
        <FormControl mb="4" isRequired maxW="500px">
          <FormLabel>Compensation</FormLabel>
          todo
        </FormControl>
      )}

      <MotifField />
      <AutreMotif />
    </>
  );
};
