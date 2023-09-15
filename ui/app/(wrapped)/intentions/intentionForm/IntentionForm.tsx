"use client";

import { Box, Collapse } from "@chakra-ui/react";
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
              ...forms[1],
              ...forms[2],
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
                ...forms[1],
                ...forms[2],
              },
            },
          })
          .call(),
    });

  const [step, setStep] = useState(
    defaultValues[1].uai &&
      defaultValues[1].cfd &&
      defaultValues[1].dispositifId
      ? 2
      : 1
  );
  const [intention, setIntention] = useState(defaultValues);

  const submitCfdUai = (values: PartialIntentionForms[1]) => {
    setIntention({ ...intention, 1: values });
    if (
      values?.uai &&
      values?.cfd &&
      values?.libelleDiplome &&
      values?.dispositifId
    ) {
      setStep(2);
      return true;
    }
  };

  const onEditUaiCfdSection = () => setStep(1);

  const { push } = useRouter();

  return (
    <Box flex={1} bg="#E2E7F8">
      <Box maxWidth={"container.xl"} mx="auto" width="100%" mt="10" mb="20">
        <CfdUaiSection
          defaultValues={intention[1]}
          formMetadata={formMetadata}
          submitCfdUai={submitCfdUai}
          onEditUaiCfdSection={onEditUaiCfdSection}
          active={step === 1}
        />
        <Collapse in={step === 2} animateOpacity>
          <InformationsBlock
            isSubmitting={isSubmitting}
            onSubmit={(values) => {
              const newIntention = {
                ...intention,
                2: values,
              } as IntentionForms;
              setIntention(newIntention);
              submit({ forms: newIntention });
              push("/intentions");
            }}
            isDraftSubmitting={isDraftSubmitting}
            onDraftSubmit={(values) =>
              submitDraft({ forms: { ...intention, 2: values } })
            }
            defaultValues={intention[2]}
          />
        </Collapse>
      </Box>
    </Box>
  );
};
