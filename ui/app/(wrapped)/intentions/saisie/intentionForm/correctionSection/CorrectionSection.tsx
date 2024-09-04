"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { SCROLL_OFFSET } from "@/app/(wrapped)/intentions/saisie/SCROLL_OFFSETS";

import { Demande } from "../../types";
import { AutreMotifField } from "./components/AutreMotifField";
import { CapaciteConstanteSection } from "./components/CapaciteConstanteSection";
import { CapaciteSection } from "./components/CapaciteSection";
import { CommentaireField } from "./components/CommentaireField";
import { MotifField } from "./components/MotifField";
import { RaisonField } from "./components/RaisonField";
import { CorrectionForms } from "./defaultFormValues";
import { Campagne } from "./types";

export const CampagneContext = createContext<{
  campagne?: Campagne;
  setCampagne: Dispatch<SetStateAction<Campagne>>;
}>({
  campagne: undefined,
  setCampagne: () => {},
});

export const CorrectionSection = ({
  correctionRef,
  demande,
  campagne,
}: {
  correctionRef: React.RefObject<HTMLDivElement>;
  demande: Demande;
  campagne?: Campagne;
}) => {
  const toast = useToast();
  const { push } = useRouter();
  const form = useForm<CorrectionForms>({
    defaultValues: {
      raison: "modification_capacite",
      coloration: demande.coloration ?? false,
      libelleColoration: demande.libelleColoration,
      ...demande.correction,
    },
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

  return (
    <Flex
      ref={correctionRef}
      scrollMarginTop={SCROLL_OFFSET}
      direction={"column"}
    >
      <FormProvider {...form}>
        <Box
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
          <Flex direction="column" gap={6}>
            <Heading as={"h3"} fontSize="lg">
              Rappel des capacités saisies
            </Heading>
            <CapaciteConstanteSection demande={demande} />
            <RaisonField campagne={campagne} />
            <Text fontSize={14}>
              Vous vous apprêtez à enregistrer de nouvelles capacités sur cette
              demande. Pour rappel : ces modifications ne seront pas prises en
              compte dans le taux de transformation affiché dans la page de
              pilotage. Attention une seule saisie est possible par demande
            </Text>
            <CapaciteSection demande={demande} />
            <MotifField campagne={campagne} />
            <AutreMotifField />
            <CommentaireField />
            <Text color="info.text" fontSize={14}>
              Après validation de ce formulaire, vous ne pourrez plus apporter
              aucune modification
            </Text>
            <Box justifyContent={"center"} ms={"auto"}>
              <Button
                isDisabled={isActionsDisabled}
                isLoading={isSubmitting}
                variant="secondary"
                color="bluefrance.113"
                onClick={handleSubmit((values) =>
                  submitCorrection({
                    body: {
                      correction: {
                        ...values,
                        intentionNumero: demande.numero ?? "",
                      },
                    },
                  })
                )}
                leftIcon={<Icon icon="ri:save-3-line" />}
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
        </Box>
      </FormProvider>
    </Flex>
  );
};
