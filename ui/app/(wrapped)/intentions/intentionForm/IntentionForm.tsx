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
  formId,
  defaultValues,
  formMetadata,
}: {
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const form = useForm<IntentionForms>({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { getValues, handleSubmit, watch } = form;

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
              },
            },
          })
          .call(),
    });

  const [step, setStep] = useState(
    defaultValues.uai && defaultValues.cfd && defaultValues.dispositifId ? 2 : 1
  );
  const step2Ref = useRef<HTMLDivElement>(null);

  const onEditUaiCfdSection = () => setStep(1);

  const { push, replace } = useRouter();

  const onSubmit = async () => {
    const newIntention = getValues();
    await submit({ forms: newIntention });
    push("/intentions");
  };

  const onDraftSubmit = async () => {
    const { id } = await submitDraft({
      forms: getValues(),
    });
    replace(id, { scroll: false });
  };

  useEffect(
    () =>
      watch(() => {
        const values = getValues();
        if (values?.uai && values?.cfd && values?.dispositifId) {
          if (step != 2)
            setTimeout(() => {
              step2Ref.current?.scrollIntoView({ behavior: "smooth" });
            }, 500);
          setStep(2);
        }
      }).unsubscribe
  );

  useEffect(() => console.log(defaultValues), []);

  return (
    <FormProvider {...form}>
      <Box
        flex={1}
        bg="#E2E7F8"
        as="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Container maxW={"container.xl"} my={12}>
          <CfdUaiSection
            formId={formId}
            defaultValues={defaultValues}
            formMetadata={formMetadata}
            onEditUaiCfdSection={onEditUaiCfdSection}
            active={step === 1}
          />
          <Collapse in={step === 2} animateOpacity ref={step2Ref}>
            <InformationsBlock
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
