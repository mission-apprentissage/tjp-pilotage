import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

const typeDemandesOptions = [
  { value: "ouverture_nette", label: "Ouverture nette" },
  { value: "ouverture_compensation", label: "Ouverture avec compensation" },
  { value: "augmentation_nette", label: "Augmentation nette" },
  { value: "augmentation_compensation", label: "Ouverture avec compensation" },
  { value: "fermeture", label: "Fermeture" },
  { value: "diminution", label: "Diminution" },
];

export const TypeDemandeField = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms[2]>();

  return (
    <FormControl
      mb="6"
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
        {typeDemandesOptions.map((typeDemandesOption) => (
          <option
            key={typeDemandesOption.value}
            value={typeDemandesOption.value}
          >
            {typeDemandesOption.label}
          </option>
        ))}
      </Select>
      {errors.typeDemande && (
        <FormErrorMessage>{errors.typeDemande.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
