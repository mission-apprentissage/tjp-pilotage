import { Box, Button, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { IntentionForms, PartialIntentionForms } from "./defaultFormValues";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  onDraftSubmit,
  isDraftSubmitting,
  formMetadata,
}: {
  defaultValues: PartialIntentionForms;
  onSubmit: (values: IntentionForms) => void;
  isSubmitting?: boolean;
  onDraftSubmit: (values: IntentionForms) => void;
  isDraftSubmitting?: boolean;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const form = useForm<IntentionForms>({
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
        mb="6"
        borderRadius={6}
      >
        <TypeDemandeSection
          formMetadata={formMetadata}
          defaultValues={defaultValues}
        />
      </Box>
      <Box
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        as="form"
        p="6"
        mt="6"
        borderRadius={6}
      >
        <CapaciteSection />
        <Flex justify="flex-end" mt="12" mb="4">
          <Button
            isLoading={isDraftSubmitting}
            variant="secondary"
            mr="4"
            onClick={() => onDraftSubmit(form.getValues())}
          >
            Enregistrer en brouillon
          </Button>
          <Button isLoading={isSubmitting} variant="primary" type="submit">
            Envoyer la demande
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
};
