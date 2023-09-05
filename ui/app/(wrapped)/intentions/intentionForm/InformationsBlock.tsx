import { Box, Button, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { ComplementaireSection } from "./complementaireSection/ComplementaireSection";
import { IntentionForms, PartialIntentionForms } from "./defaultFormValues";
import { DiplomeSection } from "./DiplomeSection/DiplomeSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  onDraftSubmit,
  isDraftSubmitting,
}: {
  defaultValues: PartialIntentionForms["2"];
  onSubmit: (values: IntentionForms[2]) => void;
  isSubmitting?: boolean;
  onDraftSubmit: (values: IntentionForms[2]) => void;
  isDraftSubmitting?: boolean;
}) => {
  const form = useForm<IntentionForms[2]>({
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
        <TypeDemandeSection />
        <DiplomeSection />
        <CapaciteSection />
        <ComplementaireSection />

        <Flex justify="flex-end" mt="10" mb="4">
          <Button
            isLoading={isDraftSubmitting}
            variant="primary"
            mr="4"
            onClick={() => onDraftSubmit(form.getValues())}
          >
            Brouillon
          </Button>
          <Button isLoading={isSubmitting} variant="primary" type="submit">
            Envoyer
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
};
