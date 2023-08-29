"use client";
import { Box, Button, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { CapaciteSection } from "@/app/(wrapped)/intentions/[intentionId]/capaciteSection/CapaciteSection";
import { DiplomeSection } from "@/app/(wrapped)/intentions/[intentionId]/DiplomeSection/DiplomeSection";
import { TypeDemandeSection } from "@/app/(wrapped)/intentions/[intentionId]/typeDemandeSection/TypeDemandeSection";

import { ComplementaireSection } from "./complementaireSection/ComplementaireSection";
import { forms } from "./defaultFormValues";

export const InformationsBlock = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: typeof forms["2"];
  onSubmit: (values: typeof forms[2]) => void;
}) => {
  const form = useForm({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = form;

  const [type, coloration] = watch(["motif", "type", "coloration"]);

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
