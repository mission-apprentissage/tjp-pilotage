"use client";

import { Box, Collapse } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { PartialIntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { api } from "../../../../api.client";
import { IntentionForms } from "./defaultFormValues";
import { InformationsBlock } from "./InformationsBlock";
import { UaiBlock } from "./UaiBlock";

export const IntentionForm = ({
  defaultValues,
}: {
  defaultValues: PartialIntentionForms;
}) => {
  const { isLoading: isSubmitting, mutateAsync } = useMutation({
    mutationFn: ({ demande }: { demande: IntentionForms }) =>
      api
        .submitDemande({
          body: {
            demande: {
              ...demande[1],
              ...demande[2],
              amiCma: demande[2].amiCma === "true",
              poursuitePedagogique: demande[2].poursuitePedagogique === "true",
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
              mutateAsync({ demande: newIntention });
            }}
            defaultValues={intention[2]}
          />
        </Collapse>
      </Box>
    </Box>
  );
};
