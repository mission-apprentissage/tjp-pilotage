"use client";

import { Box, Collapse, Container } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiType } from "shared";

import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { api } from "../../../../api.client";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import { InformationsBlock } from "./InformationsBlock";

export const UaiRegex = /^[A-Z0-9]{8}$/;

export const IntentionForm = ({
  formId,
  defaultValues,
  formMetadata,
}: {
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
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
  const [intention, setIntention] = useState(defaultValues);

  const submitCfdUai = (values: PartialIntentionForms) => {
    setIntention({ ...intention, ...values });
    if (values?.uai && values?.cfd && values?.dispositifId) {
      setStep(2);
      return true;
    }
  };

  const onEditUaiCfdSection = () => setStep(1);

  const { push, replace } = useRouter();

  const onSubmit = async (values: IntentionForms) => {
    const newIntention = {
      ...intention,
      ...values,
    } as IntentionForms;
    setIntention(newIntention);
    await submit({ forms: newIntention });
    push("/intentions");
  };

  const onDraftSubmit = async (values: PartialIntentionForms) => {
    const { id } = await submitDraft({
      forms: { ...intention, ...values },
    });
    replace(id, { scroll: false });
  };

  return (
    <Box flex={1} bg="#E2E7F8">
      <Container maxW={"container.xl"} my={12}>
        <CfdUaiSection
          formId={formId}
          defaultValues={intention}
          formMetadata={formMetadata}
          submitCfdUai={submitCfdUai}
          onEditUaiCfdSection={onEditUaiCfdSection}
          active={step === 1}
        />
        <Collapse in={step === 2} animateOpacity>
          <InformationsBlock
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            isDraftSubmitting={isDraftSubmitting}
            onDraftSubmit={onDraftSubmit}
            defaultValues={intention}
            formMetadata={formMetadata}
          />
        </Collapse>
      </Container>
    </Box>
  );
};
