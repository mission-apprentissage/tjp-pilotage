import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { MotifField } from "@/app/(wrapped)/intentions/intentionForm/typeDemandeSection/MotifField";

import { IntentionForms } from "../defaultFormValues";
import { InfoBox } from "../InfoBox";
import { AutreMotif } from "./AutreMotifField";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";

export const TypeDemandeSection = () => {
  const { watch } = useFormContext<IntentionForms[2]>();

  const [typeDemande] = watch(["typeDemande"]);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <RentreeScolaireField mb="6" maxW="752px" />
      <Flex align="flex-start">
        <TypeDemandeField maxWidth="752px" mb="6" />
        <InfoBox flex="1" mt="10" ml="6">
          <Text mb="3">
            Si j’ouvre un BAC PRO AEPA et que je ferme un BAC PRO AGORA.
          </Text>
          <OrderedList>
            <ListItem mb="2">
              Je choisis “Ouverture par compensation” dans ma première demande
              pour le BAC PRO AEPA.
            </ListItem>
            <ListItem>
              Je saisis ensuite une seconde demande de Fermeture pour le BAC PRO
              AGORA.
            </ListItem>
          </OrderedList>
        </InfoBox>
      </Flex>
      {typeDemande === "ouverture_compensation" && (
        <FormControl mb="4" isRequired maxW="752px">
          <FormLabel>Compensation</FormLabel>
          todo
        </FormControl>
      )}

      <MotifField maxW="752px" mb="6" />
      <AutreMotif mb="6" maxW="752px" />
    </>
  );
};
