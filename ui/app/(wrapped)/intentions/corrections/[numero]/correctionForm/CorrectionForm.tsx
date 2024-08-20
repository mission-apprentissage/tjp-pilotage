"use client";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { SectionBlock } from "@/app/(wrapped)/intentions/saisie/components/SectionBlock";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import { CorrectionForms } from "./defaultFormValues";
import { MotifSection } from "./motifSection/MotifSection";
import { Campagne, Intention } from "./types";

export const CampagneContext = createContext<{
  campagne?: Campagne;
  setCampagne: Dispatch<SetStateAction<Campagne>>;
}>({
  campagne: undefined,
  setCampagne: () => {},
});

export const CorrectionForm = ({
  demande,
  campagne,
}: {
  demande: Intention;
  campagne?: Campagne;
}) => {
  const toast = useToast();
  const { push } = useRouter();
  const form = useForm<CorrectionForms>({
    mode: "onTouched",
    reValidateMode: "onChange",
    disabled: campagne?.statut !== CampagneStatutEnum["en cours"],
  });

  const { handleSubmit } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmitting,
    mutateAsync: submitCorrection,
    isSuccess,
  } = client.ref("[POST]/correction/submit").useMutation({
    onSuccess: (_body) => {
      push(`/intentions/saisie`);

      let message: string | null = null;
      message = "Correction enregistrée avec succès";

      if (message) {
        toast({
          variant: "left-accent",
          title: message,
        });
      }
    },
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
    },
  });

  const isActionsDisabled = isSuccess || isSubmitting;

  const [isFCIL, _setIsFCIL] = useState<boolean>(
    demande?.metadata?.formation?.isFCIL ?? false
  );

  const { setCampagne } = useContext(CampagneContext);

  const campagneValue = useMemo(() => ({ campagne, setCampagne }), [campagne]);

  return (
    <CampagneContext.Provider value={campagneValue}>
      <FormProvider {...form}>
        <Box
          bg="blueecume.925"
          as="form"
          noValidate
          onSubmit={handleSubmit((values) =>
            submitCorrection({
              body: {
                correction: {
                  intentionNumero: demande.numero ?? "",
                  ...values,
                },
              },
            })
          )}
        >
          <Container maxW={"container.xl"} pt="4" mb={24}>
            <CfdUaiSection
              isFCIL={isFCIL}
              campagne={campagne}
              demande={demande}
            />
            <Flex direction="column" gap={6} mt={6}>
              <SectionBlock>
                <CapaciteSection demande={demande} />
              </SectionBlock>
              <SectionBlock>
                <MotifSection campagne={campagne} />
              </SectionBlock>
              <Box justifyContent={"center"} ms={"auto"}>
                <Button
                  isDisabled={isActionsDisabled}
                  isLoading={isSubmitting}
                  variant="primary"
                  onClick={handleSubmit((values) =>
                    submitCorrection({
                      body: {
                        correction: {
                          ...values,
                          intentionNumero: demande.numero ?? "",
                          campagneId: values.campagneId ?? campagne?.id,
                        },
                      },
                    })
                  )}
                  leftIcon={<CheckIcon />}
                >
                  {"Enregistrer la correction"}
                </Button>
              </Box>
            </Flex>

            <Box position="relative">
              {errors && (
                <Alert mt="8" alignItems="flex-start" status="error">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Erreur(s) lors de l'envoi</AlertTitle>
                    <AlertDescription mt="2">
                      <UnorderedList>
                        {Object.entries(errors).map(([key, msg]) => (
                          <li key={key}>{msg}</li>
                        ))}
                      </UnorderedList>
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </Box>
          </Container>
        </Box>
      </FormProvider>
    </CampagneContext.Provider>
  );
};
