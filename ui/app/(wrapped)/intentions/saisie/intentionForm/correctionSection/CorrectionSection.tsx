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
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { RaisonCorrectionType } from "shared/enum/raisonCorrectionEnum";
import { RaisonCorrectionEnum } from "shared/enum/raisonCorrectionEnum";

import { client } from "@/api.client";
import { SCROLL_OFFSET } from "@/app/(wrapped)/intentions/saisie/SCROLL_OFFSETS";
import type { Demande } from "@/app/(wrapped)/intentions/saisie/types";

import { AutreMotifField } from "./components/AutreMotifField";
import { CapaciteConstanteSection } from "./components/CapaciteConstanteSection";
import { CapaciteSection } from "./components/CapaciteSection";
import { CommentaireField } from "./components/CommentaireField";
import { MotifField } from "./components/MotifField";
import { RaisonField } from "./components/RaisonField";
import type { CorrectionForms } from "./defaultFormValues";
import type { Campagne } from "./types";

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
      capaciteScolaireActuelle: demande?.correction?.capaciteScolaireActuelle ?? demande.capaciteScolaireActuelle,
      capaciteScolaire: demande?.correction?.capaciteScolaire ?? demande.capaciteScolaire,
      capaciteScolaireColoree: demande?.correction?.capaciteScolaireColoree ?? demande.capaciteScolaireColoree,
      capaciteApprentissageActuelle:
        demande?.correction?.capaciteApprentissageActuelle ?? demande.capaciteApprentissageActuelle,
      capaciteApprentissage: demande?.correction?.capaciteApprentissage ?? demande.capaciteApprentissage,
      capaciteApprentissageColoree:
        demande?.correction?.capaciteApprentissageColoree ?? demande.capaciteApprentissageColoree,
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

  const isCorrectionDisabled = isSuccess || isSubmitting || !!demande.correction;

  const [raison, setRaison] = useState<RaisonCorrectionType>(RaisonCorrectionEnum["modification_capacite"]);

  const isRaisonModificationCapacite = () => {
    return raison === RaisonCorrectionEnum["modification_capacite"];
  };

  const isRaisonAnnulation = () => {
    return raison === RaisonCorrectionEnum["annulation"];
  };

  const isRaisonReport = () => {
    return raison === RaisonCorrectionEnum["report"];
  };

  useEffect(
    () =>
      watch((values, { name }) => {
        if (name === "raison") {
          setRaison(values.raison as RaisonCorrectionType);
        }
      }).unsubscribe,
  );
  return (
    <Flex ref={correctionRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"}>
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
            }),
          )}
        >
          <Flex direction="column" gap={6}>
            <Heading as={"h3"} fontSize="lg">
              Rappel des capacités saisies
            </Heading>
            <CapaciteConstanteSection demande={demande} />
            <RaisonField campagne={campagne} disabled={isCorrectionDisabled} />
            <Flex direction={"column"}>
              {isRaisonModificationCapacite() ? (
                <Text color="info.text">
                  Vous vous apprêtez à enregistrer de nouvelles capacités sur cette demande.
                </Text>
              ) : isRaisonAnnulation() ? (
                <Text color="info.text">Annuler la demande indique que le projet ne sera pas mis en oeuvre.</Text>
              ) : isRaisonReport() ? (
                <Text color="info.text">
                  Reporter la demande indique que le projet sera mis en oeuvre ultérieurement. Une nouvelle saisie ou
                  une duplication devront avoir lieu lors d’une prochaine campagne.
                </Text>
              ) : null}
              <Text fontSize={14} color={"info.text"} mb={4}>
                Pour rappel : ces modifications ne seront pas prises en compte dans le taux de transformation affiché
                dans la page de pilotage.
              </Text>
              <Collapse in={isRaisonModificationCapacite()} unmountOnExit>
                <CapaciteSection demande={demande} disabled={isCorrectionDisabled} />
              </Collapse>
            </Flex>
            <MotifField campagne={campagne} disabled={isCorrectionDisabled} />
            <AutreMotifField disabled={isCorrectionDisabled} />
            <CommentaireField disabled={isCorrectionDisabled} />
            {!isCorrectionDisabled && (
              <>
                <Text color="info.text" fontSize={14}>
                  Après validation de ce formulaire, vous ne pourrez plus apporter aucune modification
                </Text>
                <Box justifyContent={"center"} ms={"auto"}>
                  <Button
                    isDisabled={isCorrectionDisabled}
                    isLoading={isSubmitting}
                    variant="secondary"
                    color="bluefrance.113"
                    onClick={handleSubmit((correction) => {
                      if (isRaisonModificationCapacite()) {
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
                            capaciteScolaireActuelle: demande.capaciteScolaireActuelle ?? 0,
                            capaciteScolaire: demande.capaciteScolaireActuelle ?? 0,
                            capaciteApprentissageActuelle: demande.capaciteApprentissageActuelle ?? 0,
                            capaciteApprentissage: demande.capaciteApprentissageActuelle ?? 0,
                            capaciteScolaireColoreeActuelle: 0,
                            capaciteScolaireColoree: 0,
                            capaciteApprentissageColoreeActuelle: 0,
                            capaciteApprentissageColoree: 0,
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
