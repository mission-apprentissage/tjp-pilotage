import { Divider, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { Form } from "@/app/(wrapped)/intentions/[intentionId]/defaultFormValues";

export const CapaciteSection = ({
  defaultValues,
}: {
  defaultValues: Form["2"];
}) => {
  const {
    formState: { errors },
  } = useFormContext<Form[2]>();

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
