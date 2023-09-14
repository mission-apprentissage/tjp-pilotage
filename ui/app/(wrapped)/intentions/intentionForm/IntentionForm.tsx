"use client";

import { Box, Collapse } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
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

function toBoolean<
  V extends string | undefined,
  R = V extends undefined ? boolean | undefined : boolean
>(value: V): R {
  if (typeof value === "undefined") return undefined as R;
  return (value === "true") as R;
}

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
              ...forms[1],
              ...forms[2],
              amiCma: toBoolean(forms[2].amiCma),
              poursuitePedagogique: toBoolean(forms[2].poursuitePedagogique),
              rentreeScolaire: parseInt(forms[2].rentreeScolaire),
              libelleColoration: forms[2].libelleColoration,
              coloration: toBoolean(forms[2].coloration),
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
                amiCma: toBoolean(forms[2].amiCma),
                poursuitePedagogique: toBoolean(forms[2].poursuitePedagogique),
                rentreeScolaire:
                  parseInt(forms[2].rentreeScolaire ?? "") || undefined,
                coloration: toBoolean(forms[2].coloration),
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

  const onEditUaiCfdSection = () => {
    setStep(1);
  };

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
              console.log("submit", newIntention);
              submit({ forms: newIntention });
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
