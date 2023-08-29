import { Divider, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { forms } from "../defaultFormValues";

export const CapaciteSection = ({
  defaultValues,
}: {
  defaultValues: typeof forms["2"];
}) => {
  const {
    formState: { errors },
    control,
    register,
    watch,
  } = useFormContext<typeof forms[2]>();

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
