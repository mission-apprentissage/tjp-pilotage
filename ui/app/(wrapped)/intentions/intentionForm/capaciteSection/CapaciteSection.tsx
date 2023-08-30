import { Divider, Heading } from "@chakra-ui/react";

import { IntentionForms } from "../defaultFormValues";

export const CapaciteSection = (_: { defaultValues: IntentionForms["2"] }) => {
  return (
    <>
      <Heading as="h2" fontSize="xl" mt="8">
        Capacités prévisionnelles pour cette famille de métier
      </Heading>
      <Divider pt="4" mb="4" />
      Todo...
    </>
  );
};
