"use client";

import { Box, Collapse } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { PartialIntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { api } from "../../../../api.client";
import { IntentionForms } from "./defaultFormValues";
import { InformationsBlock } from "./InformationsBlock";
import { UaiBlock } from "./UaiBlock";

function toBoolean<
  V extends string | undefined,
  R = V extends undefined ? boolean | undefined : boolean
>(value: V): R {
  if (typeof value === "undefined") return undefined as R;
  return (value === "true") as R;
}

export const IntentionForm = ({
  defaultValues,
}: {
  defaultValues: PartialIntentionForms;
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
              },
            },
          })
          .call(),
    });

  const [step, setStep] = useState(1);

  const [intention, setIntention] = useState(defaultValues);

  return (
    <Box flex={1} bg="#E2E7F8">
      <Box maxW="900px" mx="auto" width="100%" mt="10" mb="20">
        <UaiBlock
          onOpen={() => setStep(1)}
          active={step === 1}
          defaultValues={intention[1]}
          onSubmit={(values) => {
            setIntention({ ...intention, 1: values });
            setStep(2);
          }}
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
