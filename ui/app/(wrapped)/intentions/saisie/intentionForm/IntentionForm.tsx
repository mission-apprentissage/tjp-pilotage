"use client";

import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Container, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiType } from "shared";

import { ConfirmationDelete } from "@/app/(wrapped)/intentions/saisie/components/ConfirmationDelete";
import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { api } from "../../../../../api.client";
import { Breadcrumb } from "../../../../../components/Breadcrumb";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import { InformationsBlock } from "./InformationsBlock";

export const IntentionForm = ({
  disabled = true,
  formId,
  defaultValues,
  formMetadata,
}: {
  disabled?: boolean;
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const form = useForm<IntentionForms>({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { getValues, handleSubmit } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmittingDemande,
    mutateAsync: submitDemande,
    isSuccess: isDemandeSuccess,
  } = useMutation({
    mutationFn: (forms: IntentionForms) =>
      api.submitDemande({ body: { demande: { id: formId, ...forms } } }).call(),
    onSuccess: () => push("/intentions/saisie"),
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
    },
  });

  const {
    isLoading: isSubmittingDraft,
    mutateAsync: submitDraft,
    isSuccess: isDraftSuccess,
  } = useMutation({
    mutationFn: (forms: IntentionForms) =>
      api
        .submitDraftDemande({ body: { demande: { id: formId, ...forms } } })
        .call(),
    onSuccess: () => push("/intentions/saisie"),
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
    },
  });

  const {
    isLoading: isDeleting,
    mutateAsync: deleteDemande,
    isSuccess: isDeleteSuccess,
  } = useMutation({
    mutationFn: async () => {
      if (!formId) return;
      await api.deleteDemande({ params: { id: formId } }).call();
    },
    onSuccess: () => push("/intentions/saisie"),
  });

  const isSubmitting = isSubmittingDraft || isSubmittingDemande || isDeleting;
  const isSuccess = isDraftSuccess || isDeleteSuccess || isDemandeSuccess;
  const isActionsDisabled = isSuccess || isSubmitting;

  const [isFCIL, setIsFCIL] = useState<boolean>(
    formMetadata?.formation?.isFCIL ?? false
  );

  const isCFDUaiSectionValid = ({
    cfd,
    dispositifId,
    libelleFCIL,
    uai,
  }: Partial<IntentionForms>): boolean => {
    if (isFCIL) return !!(cfd && dispositifId && libelleFCIL && uai);
    return !!(cfd && dispositifId && uai);
  };

  const [step, setStep] = useState(isCFDUaiSectionValid(getValues()) ? 2 : 1);
  const step2Ref = useRef<HTMLDivElement>(null);

  const onEditUaiCfdSection = () => setStep(1);

  useEffect(() => {
    if (isCFDUaiSectionValid(getValues())) {
      submitCFDUAISection();
    }
  }, []);

  const submitCFDUAISection = () => {
    if (step != 2)
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    setStep(2);
  };

  return (
    <>
      <FormProvider {...form}>
        <Box
          flex={1}
          bg="blue.faded"
          as="form"
          noValidate
          onSubmit={handleSubmit((values) => submitDemande(values))}
        >
          <Container maxW={"container.xl"} pt="4" mb={24}>
            <Breadcrumb
              ml={4}
              mb={4}
              pages={[
                { title: "Accueil", to: "/" },
                { title: "Recueil des demandes", to: "/intentions" },
                pathname === "/intentions/saisie/new"
                  ? {
                      title: "Nouvelle demande",
                      to: "/intentions/saisie/new",
                      active: true,
                    }
                  : {
                      title: `Demande n°${formId}`,
                      to: `/intentions/saisie/${formId}`,
                      active: true,
                    },
              ]}
            />
            <CfdUaiSection
              formId={formId}
              defaultValues={defaultValues}
              formMetadata={formMetadata}
              onEditUaiCfdSection={onEditUaiCfdSection}
              active={step === 1}
              disabled={disabled}
              isFCIL={isFCIL}
              setIsFCIL={setIsFCIL}
              isCFDUaiSectionValid={isCFDUaiSectionValid}
              submitCFDUAISection={submitCFDUAISection}
            />
            <Collapse in={step === 2} animateOpacity ref={step2Ref}>
              <InformationsBlock
                disabled={disabled}
                errors={errors}
                formMetadata={formMetadata}
                footerActions={
                  <>
                    {formId && (
                      <ConfirmationDelete
                        onConfirm={deleteDemande}
                        Trigger={({ onClick }) => (
                          <Button
                            onClick={onClick}
                            color="red"
                            borderColor="red"
                            mr="auto"
                            isDisabled={disabled || isActionsDisabled}
                            isLoading={isDeleting}
                            variant="secondary"
                            leftIcon={<DeleteIcon />}
                          >
                            Supprimer la demande
                          </Button>
                        )}
                      />
                    )}
                    <Box justifyContent={"center"}>
                      <Button
                        isDisabled={disabled || isActionsDisabled}
                        isLoading={isSubmittingDraft}
                        variant="secondary"
                        onClick={handleSubmit((values) => submitDraft(values))}
                      >
                        Enregistrer le projet de demande
                      </Button>
                      <Text fontSize={"xs"} mt="1" align={"center"}>
                        (Phase d'enregistrement du 02 au 16 octobre)
                      </Text>
                    </Box>
                    <Box justifyContent={"center"}>
                      <Button
                        isDisabled={disabled || isActionsDisabled}
                        isLoading={isSubmittingDemande}
                        variant="primary"
                        type="submit"
                      >
                        Valider la demande définitive
                      </Button>
                      <Text fontSize={"xs"} mt="1" align={"center"}>
                        Pour soumission au vote du Conseil Régional
                      </Text>
                    </Box>
                  </>
                }
              />
            </Collapse>
          </Container>
        </Box>
      </FormProvider>
    </>
  );
};
