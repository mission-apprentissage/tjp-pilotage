import { Box, Button, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "@/api.client";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { ComplementaireSection } from "./complementaireSection/ComplementaireSection";
import { IntentionForms, PartialIntentionForms } from "./defaultFormValues";
import { DiplomeSection } from "./DiplomeSection/DiplomeSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  defaultValues,
  formMetadata,
  onSubmit,
  isSubmitting,
  onDraftSubmit,
  isDraftSubmitting,
}: {
  defaultValues: PartialIntentionForms["2"];
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
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
        <DiplomeSection formMetadata={formMetadata} />
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
