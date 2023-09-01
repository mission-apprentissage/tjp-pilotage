"use client";

import { Box, Collapse } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../../../api.client";
import { IntentionForms } from "./defaultFormValues";
import { InformationsBlock } from "./InformationsBlock";
import { UaiBlock } from "./UaiBlock";

export const UaiRegex = /^[A-Z0-9]{8}$/;

export const IntentionForm = ({
  defaultValues,
}: {
  defaultValues: IntentionForms;
}) => {
  const [step, setStep] = useState(1);

  const [intention, setIntention] = useState(defaultValues);

  const { data, mutateAsync: checkUai } = useMutation({
    mutationFn: async (uai: string) => {
      if (!UaiRegex.test(uai)) return await { status: "wrong_format" as const };
      return await api.checkUai({ params: { uai } }).call();
    },
  });

  const submit = async (values: { searchEtab?: string }) => {
    if (!values.searchEtab) return false;
    const validation = await checkUai(values.searchEtab);
    if (validation.status === "valid") {
      setIntention({ ...intention, 1: values });
      setStep(2);
      return true;
    } else {
      return "Le code UAI est introuvable";
    }
  };

  return (
    <Box flex={1} bg="#E2E7F8">
      <Box maxW="900px" mx="auto" width="100%" mt="10" mb="20">
        <UaiBlock
          onOpen={() => setStep(1)}
          active={step === 1}
          defaultValues={intention[1]}
          checkUaiData={data}
          onSubmit={(values) => {
            if (values.searchEtab) {
              submit(values);
            }
          }}
        />
        <Collapse in={step === 2} animateOpacity>
          <InformationsBlock
            onSubmit={(values) => {
              const newIntention = { ...intention, 2: values };
              setIntention(newIntention);
              console.log("submit", newIntention);
            }}
            defaultValues={intention[2]}
          />
        </Collapse>
      </Box>
    </Box>
  );
};
