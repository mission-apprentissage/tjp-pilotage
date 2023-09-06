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
import { InformationsBlock } from "./InformationsBlock";
import { UaiBlock } from "./UaiBlock";

export const UaiRegex = /^[A-Z0-9]{8}$/;

function toBoolean<
  V extends string | undefined,
  R = V extends undefined ? boolean | undefined : boolean
>(value: V): R {
  if (typeof value === "undefined") return undefined as R;
  return (value === "true") as R;
}

export const IntentionForm = ({
  defaultValues,
  formMetadata,
}: {
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

  const [step, setStep] = useState(defaultValues[1].uai ? 2 : 1);

  const [intention, setIntention] = useState(defaultValues);

  const submitUai = async (values: { uai?: string }) => {
    setIntention({ ...intention, 1: values });
    setStep(2);
    return true;
  };

  return (
    <Box flex={1} bg="#E2E7F8">
      <Box maxW="900px" mx="auto" width="100%" mt="10" mb="20">
        <UaiBlock
          defaultEtablissement={formMetadata?.etablissement}
          onOpen={() => setStep(1)}
          active={step === 1}
          defaultValues={intention[1]}
          onSubmit={(values) => {
            if (values.uai) {
              submitUai(values);
            }
          }}
        />
        <Collapse in={step === 2} animateOpacity>
          <InformationsBlock
            formMetadata={formMetadata}
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
