import {
  Collapse,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { MotifField } from "@/app/(wrapped)/intentions/intentionForm/typeDemandeSection/MotifField";

import { IntentionForms } from "../defaultFormValues";

export const TypeDemandeSection = () => {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<IntentionForms[2]>();

  const [motif, typeDemande] = watch(["motif", "typeDemande"]);
  console.log(typeDemande);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <FormControl
        mb="4"
        maxW="500px"
        isInvalid={!!errors.typeDemande}
        isRequired
      >
        <FormLabel>Ma demande concerne</FormLabel>
        <Select
          bg="white"
          {...register("typeDemande", {
            required: "Le type de demande est obligatoire",
          })}
          placeholder="Sélectionner une option"
        >
          <option value="ouverture">Ouverture</option>
          <option value="ouverture_compensation">
            Ouverture avec compensation
          </option>
          <option value="fermeture">Fermeture</option>
          <option value="augmentation">Augmentation</option>
          <option value="diminution">Diminution</option>
          <option value="fcil">FCIL</option>
        </Select>
        {errors.typeDemande && (
          <FormErrorMessage>{errors.typeDemande.message}</FormErrorMessage>
        )}
      </FormControl>
      {typeDemande === "ouverture_compensation" && (
        <FormControl mb="4" isRequired maxW="500px">
          <FormLabel>Compensation</FormLabel>
          todo
        </FormControl>
      )}

      <MotifField />

      <Collapse in={(motif as string[])?.includes("10")} unmountOnExit>
        <FormControl
          mb="4"
          maxW="500px"
          isInvalid={!!errors.autreMotif}
          isRequired
        >
          <FormLabel>Autre motif</FormLabel>
          {(motif as string[])?.includes("10") && (
            <Textarea
              {...register("autreMotif", {
                shouldUnregister: true,
                required: "Veuillez préciser votre motif",
              })}
            />
          )}
          {errors.autreMotif && (
            <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    </>
  );
};
