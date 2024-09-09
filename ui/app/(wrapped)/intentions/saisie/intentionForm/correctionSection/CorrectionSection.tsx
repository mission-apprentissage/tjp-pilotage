"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { RaisonCorrectionEnum } from "shared/enum/raisonCorrectionEnum";

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
    disabled: !!demande.correction,
  });

  const { handleSubmit, watch } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmitting,
    mutateAsync: submitCorrection,
    isSuccess,
  } = client.ref("[POST]/correction/submit").useMutation({
    onSuccess: (_body) => {
      push(`/intentions/saisie?campagne=${campagne?.annee}`);

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

  const isCorrectionDisabled =
    isSuccess || isSubmitting || !!demande.correction;

  const [isModificationCapacite, setIsModificationCapacite] =
    useState<boolean>(true);

  useEffect(
    () =>
      watch((values, { name }) => {
        if (name === "raison") {
          setIsModificationCapacite(
            values.raison === RaisonCorrectionEnum["modification_capacite"]
          );
        }
      }).unsubscribe
  );
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
            <RaisonField campagne={campagne} disabled={isCorrectionDisabled} />
            <Flex direction={"column"}>
              {isModificationCapacite ? (
                <Text color="info.text">
                  Vous vous apprêtez à enregistrer de nouvelles capacités sur
                  cette demande.
                </Text>
              ) : (
                <Text color="info.text">
                  Si vous annulez ou reportez la demande, les capacités de la
                  formation seront remises au niveau antérieur à la validation
                  de votre demande.
                </Text>
              )}
              <Text fontSize={14} color={"info.text"} mb={4}>
                Pour rappel : ces modifications ne seront pas prises en compte
                dans le taux de transformation affiché dans la page de pilotage.
              </Text>
              <Collapse in={isModificationCapacite} unmountOnExit>
                <CapaciteSection
                  demande={demande}
                  disabled={isCorrectionDisabled}
                />
              </Collapse>
            </Flex>
            <MotifField campagne={campagne} disabled={isCorrectionDisabled} />
            <AutreMotifField disabled={isCorrectionDisabled} />
            <CommentaireField disabled={isCorrectionDisabled} />
            {!isCorrectionDisabled && (
              <>
                <Text color="info.text" fontSize={14}>
                  Après validation de ce formulaire, vous ne pourrez plus
                  apporter aucune modification
                </Text>
                <Box justifyContent={"center"} ms={"auto"}>
                  <Button
                    isDisabled={isCorrectionDisabled}
                    isLoading={isSubmitting}
                    variant="secondary"
                    color="bluefrance.113"
                    onClick={handleSubmit((correction) => {
                      if (isModificationCapacite) {
                        return submitCorrection({
                          body: {
                            correction: {
                              ...correction,
                              intentionNumero: demande.numero ?? "",
                            },
                          },
                        });
                      }
                      return submitCorrection({
                        body: {
                          correction: {
                            ...correction,
                            ...demande,
                            intentionNumero: demande.numero ?? "",
                            capaciteScolaire:
                              demande.capaciteScolaireActuelle ?? 0,
                            capaciteApprentissage:
                              demande.capaciteApprentissageActuelle ?? 0,
                            capaciteScolaireActuelle:
                              demande.capaciteScolaireActuelle ?? 0,
                            capaciteScolaireColoree: 0,
                            capaciteApprentissageActuelle:
                              demande.capaciteApprentissageActuelle ?? 0,
                            capaciteApprentissageColoree: 0,
                            coloration: demande.coloration ?? false,
                            libelleColoration: demande.libelleColoration,
                            motif: correction.motif,
                          },
                        },
                      });
                    })}
                    leftIcon={<Icon icon="ri:save-3-line" />}
                  >
                    {"Enregistrer la correction"}
                  </Button>
                </Box>
              </>
            )}
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
