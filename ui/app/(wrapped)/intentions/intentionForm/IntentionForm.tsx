"use client";

import { Box, Collapse, Container } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiType } from "shared";

import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { api } from "../../../../api.client";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import { InformationsBlock } from "./InformationsBlock";

export const IntentionForm = ({
  canEdit = false,
  formId,
  defaultValues,
  formMetadata,
}: {
  canEdit?: boolean;
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const form = useForm<IntentionForms>({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { getValues, handleSubmit } = form;

  const { isLoading: isSubmitting, mutateAsync: submit } = useMutation({
    mutationFn: ({ forms }: { forms: IntentionForms }) =>
      api
        .submitDemande({
          body: {
            demande: {
              id: formId,
              ...forms,
            },
          },
        })
        .call(),
  });

  const { isLoading: isDraftSubmitting, mutateAsync: submitDraft } =
    useMutation({
      mutationFn: ({ forms }: { forms: PartialIntentionForms }) =>
        api
          .submitDraftDemande({
            body: {
              demande: {
                id: formId,
                ...forms,
                uai: forms.uai!,
              },
            },
          })
          .call(),
    });

  const [isFCIL, setIsFCIL] = useState<boolean>(
    formMetadata?.formation?.isFCIL ?? false
  );

  const isCFDUaiSectionValid = (
    cfd?: string,
    dispositifId?: string,
    libelleFCIL?: string,
    uai?: string
  ): boolean => {
    if (isFCIL)
      return (
        cfd != "" &&
        cfd != undefined &&
        dispositifId != "" &&
        dispositifId != undefined &&
        libelleFCIL != "" &&
        libelleFCIL != undefined &&
        uai != "" &&
        uai != undefined
      );
    return (
      cfd != "" &&
      cfd != undefined &&
      dispositifId != "" &&
      dispositifId != undefined &&
      uai != "" &&
      uai != undefined
    );
  };

  const [step, setStep] = useState(
    isCFDUaiSectionValid(
      defaultValues.cfd,
      defaultValues.dispositifId,
      defaultValues.libelleFCIL,
      defaultValues.uai
    )
      ? 2
      : 1
  );
  const step2Ref = useRef<HTMLDivElement>(null);

  const onEditUaiCfdSection = () => setStep(1);

  const { push } = useRouter();

  const onSubmit = async () => {
    await submit({ forms: getValues() });
    push("/intentions");
  };

  const onDraftSubmit = async () => {
    await submitDraft({ forms: getValues() });
    push("/intentions");
  };

  useEffect(() => {
    const values = getValues();
    if (
      isCFDUaiSectionValid(
        values?.cfd,
        values.dispositifId,
        values?.libelleFCIL,
        values?.uai
      )
    ) {
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
    <FormProvider {...form}>
      <Box
        flex={1}
        bg="#E2E7F8"
        as="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Container maxW={"container.xl"} my={12} mb={24}>
          <CfdUaiSection
            formId={formId}
            defaultValues={defaultValues}
            formMetadata={formMetadata}
            onEditUaiCfdSection={onEditUaiCfdSection}
            active={step === 1}
            isFCIL={isFCIL}
            setIsFCIL={setIsFCIL}
            isCFDUaiSectionValid={isCFDUaiSectionValid}
            submitCFDUAISection={submitCFDUAISection}
          />
          <Collapse in={step === 2} animateOpacity ref={step2Ref}>
            <InformationsBlock
              canEdit={canEdit}
              isSubmitting={isSubmitting}
              isDraftSubmitting={isDraftSubmitting}
              onDraftSubmit={onDraftSubmit}
              formMetadata={formMetadata}
            />
          </Collapse>
        </Container>
      </Box>
    </FormProvider>
  );
};
