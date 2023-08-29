"use client";

import { Box, Collapse } from "@chakra-ui/react";
import { useState } from "react";

import { forms } from "./defaultFormValues";
import { InformationsBlock } from "./InformationsBlock";
import { UaiBlock } from "./UaiBlock";

export const IntentionForm = () => {
  const [step, setStep] = useState(1);

  const [intention, setIntention] = useState(forms);

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
            onSubmit={(values) => {
              const newIntention = { ...intention, 2: values };
              setIntention(newIntention);
              console.log(newIntention);
            }}
            defaultValues={intention[2]}
          />
        </Collapse>
      </Box>
    </Box>
  );
};
