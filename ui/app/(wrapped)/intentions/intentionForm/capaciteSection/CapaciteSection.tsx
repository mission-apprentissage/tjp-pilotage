import { Divider, Heading } from "@chakra-ui/react";

import { Form } from "../defaultFormValues";

export const CapaciteSection = ({
  defaultValues,
}: {
  defaultValues: Form["2"];
}) => {
  return (
    <>
      <Heading as="h2" fontSize="xl" mt="8">
        Capacité prévisionnelles pour cette famille de métier
      </Heading>
      <Divider pt="4" mb="4" />
      Todo...
    </>
  );
};
