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
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { RaisonCorrectionType } from "shared/enum/raisonCorrectionEnum";
import { RaisonCorrectionEnum } from "shared/enum/raisonCorrectionEnum";
import type { CampagneType } from "shared/schema/campagneSchema";

import { client } from "@/api.client";
import type { CorrectionFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { SCROLL_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";
import type { Demande } from "@/app/(wrapped)/demandes/types";
import { getRoutingSaisieDemande } from "@/utils/getRoutingDemande";
import { useAuth } from "@/utils/security/useAuth";

import { AutreMotifField } from "./components/AutreMotifField";
import { CapaciteConstanteSection } from "./components/CapaciteConstanteSection";
import { CapaciteSection } from "./components/CapaciteSection";
import { CommentaireField } from "./components/CommentaireField";
import { MotifField } from "./components/MotifField";
import { RaisonField } from "./components/RaisonField";

const getCorrectionDescription = (raison: RaisonCorrectionType) => {
  switch (raison) {
  case RaisonCorrectionEnum["modification_capacite"]:
    return (
      <Text color="info.text">
      Vous vous apprêtez à enregistrer de nouvelles capacités sur cette demande.
      </Text>
    );
  case RaisonCorrectionEnum["annulation"]:
    return (
      <Text color="info.text">Annuler la demande indique que le projet ne sera pas mis en oeuvre.</Text>
    );
  case RaisonCorrectionEnum["report"]:
    return (
      <Text color="info.text">
        Reporter la demande indique que le projet sera mis en oeuvre ultérieurement. Une nouvelle saisie ou
        une duplication devront avoir lieu lors d’une prochaine campagne.
      </Text>
    );
  default:
    return null;
  }
};

export const CorrectionSection = ({
  correctionRef,
  demande,
  campagne,
  disabled,
}: {
  correctionRef: React.RefObject<HTMLDivElement>;
  demande: Demande;
  campagne: CampagneType;
  disabled?: boolean;
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const { push } = useRouter();
  const form = useForm<CorrectionFormType>({
    defaultValues: {
      raison: RaisonCorrectionEnum["modification_capacite"],
      demandeNumero: demande.numero,
      coloration: demande.coloration,
      libelleColoration: demande.libelleColoration,
      capaciteScolaireActuelle: demande.correction?.capaciteScolaireActuelle ?? demande.capaciteScolaireActuelle,
      capaciteScolaire: demande.correction?.capaciteScolaire ?? demande.capaciteScolaire,
      capaciteScolaireColoree: demande.correction?.capaciteScolaireColoree ?? demande.capaciteScolaireColoree,
      capaciteScolaireColoreeActuelle:
        demande.correction?.capaciteScolaireColoreeActuelle ?? demande.capaciteScolaireColoreeActuelle,
      capaciteApprentissageActuelle:
        demande.correction?.capaciteApprentissageActuelle ?? demande.capaciteApprentissageActuelle,
      capaciteApprentissage: demande.correction?.capaciteApprentissage ?? demande.capaciteApprentissage,
      capaciteApprentissageColoree:
        demande.correction?.capaciteApprentissageColoree ?? demande.capaciteApprentissageColoree,
      capaciteApprentissageColoreeActuelle:
        demande.correction?.capaciteApprentissageColoreeActuelle ?? demande.capaciteApprentissageColoreeActuelle,
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
      push(getRoutingSaisieDemande({user, suffix: `?campagne=${campagne?.annee}`}));

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

  const isCorrectionDisabled = isSuccess || isSubmitting || !!demande.correction || disabled;

  const [raison, setRaison] = useState<RaisonCorrectionType>(RaisonCorrectionEnum["modification_capacite"]);

  useEffect(
    () =>
      watch((values, { name }) => {
        if (name === "raison") {
          setRaison(values.raison as RaisonCorrectionType);
        }
      }).unsubscribe
  );

  return (
    <Flex ref={correctionRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"}>
      <FormProvider {...form}>
        <Box
          as="form"
          noValidate
          onSubmit={handleSubmit((correction) =>
            submitCorrection({
              body: {
                correction
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
              {getCorrectionDescription(raison)}
              <Text fontSize={14} color={"info.text"} mb={4}>
                Pour rappel : ces modifications ne seront pas prises en compte dans le taux de transformation affiché
                dans la page de pilotage.
              </Text>
              <Collapse in={raison === RaisonCorrectionEnum["modification_capacite"]} unmountOnExit>
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
                      if (raison === RaisonCorrectionEnum["modification_capacite"]) {
                        return submitCorrection({
                          body: {
                            correction
                          },
                        });
                      }
                      return submitCorrection({
                        body: {
                          correction: {
                            ...demande,
                            ...correction,
                            capaciteScolaireActuelle: demande.capaciteScolaireActuelle ?? 0,
                            capaciteScolaire: demande.capaciteScolaireActuelle ?? 0,
                            capaciteApprentissageActuelle: demande.capaciteApprentissageActuelle ?? 0,
                            capaciteApprentissage: demande.capaciteApprentissageActuelle ?? 0,
                            capaciteScolaireColoreeActuelle: 0,
                            capaciteScolaireColoree: 0,
                            capaciteApprentissageColoreeActuelle: 0,
                            capaciteApprentissageColoree: 0,
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
