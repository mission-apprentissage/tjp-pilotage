"use client";

import { Box, Button, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { ComplementaireSection } from "./complementaireSection/ComplementaireSection";
import { Form } from "./defaultFormValues";
import { DiplomeSection } from "./DiplomeSection/DiplomeSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: Form["2"];
  onSubmit: (values: Form[2]) => void;
}) => {
  const form = useForm({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <Box
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        as="form"
        p="6"
        mt="6"
        borderRadius={6}
      >
        <TypeDemandeSection defaultValues={defaultValues} />
        <DiplomeSection />
        <CapaciteSection defaultValues={defaultValues} />
        <ComplementaireSection defaultValues={defaultValues} />

        <Flex mt="10" mb="4">
          <Button variant="primary" type="submit">
            Envoyer
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
};
