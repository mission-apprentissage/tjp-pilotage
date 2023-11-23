"use client";

import { Box, Button, Collapse, Container, Text } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { client } from "../../../../../api.client";
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
  formMetadata?: (typeof client.infer)["[GET]/demande/:id"]["metadata"];
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
  } = client.ref("[POST]/demande/submit").useMutation({
    onSuccess: () => push("/intentions/saisie"),
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
    },
  });

  const {
    isLoading: isSubmittingDraft,
    mutateAsync: submitDraft,
    isSuccess: isDraftSuccess,
  } = client.ref("[POST]/demande/draft").useMutation({
    onSuccess: () => push("/intentions/saisie"),
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
    },
  });

  const isSubmitting = isSubmittingDraft || isSubmittingDemande;
  const isSuccess = isDraftSuccess || isDemandeSuccess;
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
          bg="blueecume.925"
          as="form"
          noValidate
          onSubmit={handleSubmit((values) =>
            submitDemande({ body: { demande: { id: formId, ...values } } })
          )}
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
                    <Box justifyContent={"center"}>
                      <Button
                        isDisabled={disabled || isActionsDisabled}
                        isLoading={isSubmittingDraft}
                        variant="secondary"
                        onClick={handleSubmit((values) =>
                          submitDraft({
                            body: { demande: { id: formId, ...values } },
                          })
                        )}
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
