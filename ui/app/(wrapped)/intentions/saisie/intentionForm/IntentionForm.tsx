"use client";

import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Container } from "@chakra-ui/react";
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
    isLoading: isSubmitting,
    mutateAsync: submitDemande,
    isSuccess: isSuccess,
  } = client.ref("[POST]/demande/submit").useMutation({
    onSuccess: (body) => push(`/intentions/saisie?action=${body.status}`),
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
    },
  });

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

  const statusComponentRef = useRef<HTMLDivElement>(null);

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
              statusComponentRef={statusComponentRef}
            />
            <Collapse in={step === 2} animateOpacity ref={step2Ref}>
              <InformationsBlock
                formId={formId}
                disabled={disabled}
                errors={errors}
                formMetadata={formMetadata}
                footerActions={
                  <>
                    <Box justifyContent={"center"} ref={statusComponentRef}>
                      <Button
                        isDisabled={
                          disabled ||
                          isActionsDisabled ||
                          !form.formState.isDirty
                        }
                        isLoading={isSubmitting}
                        variant="primary"
                        onClick={handleSubmit((values) =>
                          submitDemande({
                            body: {
                              demande: {
                                id: formId,
                                ...values,
                                status: formId ? values.status : "draft",
                              },
                            },
                          })
                        )}
                        leftIcon={<CheckIcon />}
                      >
                        {formId
                          ? "Sauvegarder les modifications"
                          : "Enregistrer le projet de demande"}
                      </Button>
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
