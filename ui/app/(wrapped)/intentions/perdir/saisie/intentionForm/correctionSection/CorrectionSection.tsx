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
import type { Intention } from "@/app/(wrapped)/intentions/perdir/types";
import { SCROLL_OFFSET } from "@/app/(wrapped)/intentions/saisie/SCROLL_OFFSETS";
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";

import { AutreMotifField } from "./components/AutreMotifField";
import { CapaciteConstanteSection } from "./components/CapaciteConstanteSection";
import { CapaciteSection } from "./components/CapaciteSection";
import { CommentaireField } from "./components/CommentaireField";
import { MotifField } from "./components/MotifField";
import { RaisonField } from "./components/RaisonField";
import type { CorrectionForms } from "./defaultFormValues";

export const CorrectionSection = ({
  correctionRef,
  intention,
  campagne,
}: {
  correctionRef: React.RefObject<HTMLDivElement>;
  intention: Intention;
  campagne: CampagneType;
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const { push } = useRouter();
  const form = useForm<CorrectionForms>({
    defaultValues: {
      raison: RaisonCorrectionEnum["modification_capacite"],
      intentionNumero: intention.numero,
      coloration: intention.coloration,
      libelleColoration: intention.libelleColoration,
      capaciteScolaireActuelle: intention.correction?.capaciteScolaireActuelle ?? intention.capaciteScolaireActuelle,
      capaciteScolaire: intention.correction?.capaciteScolaire ?? intention.capaciteScolaire,
      capaciteScolaireColoree: intention.correction?.capaciteScolaireColoree ?? intention.capaciteScolaireColoree,
      capaciteScolaireColoreeActuelle:
        intention.correction?.capaciteScolaireColoreeActuelle ?? intention.capaciteScolaireColoreeActuelle,
      capaciteApprentissageActuelle:
        intention.correction?.capaciteApprentissageActuelle ?? intention.capaciteApprentissageActuelle,
      capaciteApprentissage: intention.correction?.capaciteApprentissage ?? intention.capaciteApprentissage,
      capaciteApprentissageColoree:
        intention.correction?.capaciteApprentissageColoree ?? intention.capaciteApprentissageColoree,
      capaciteApprentissageColoreeActuelle:
        intention.correction?.capaciteApprentissageColoreeActuelle ?? intention.capaciteApprentissageColoreeActuelle,
      ...intention.correction,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
    disabled: !!intention.correction,
  });

  const { handleSubmit, watch } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmitting,
    mutateAsync: submitCorrection,
    isSuccess,
  } = client.ref("[POST]/correction/submit").useMutation({
    onSuccess: (_body) => {
      push(getRoutingSaisieRecueilDemande({campagne, user, suffix: `?campagne=${campagne?.annee}`}));

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

  const isCorrectionDisabled = isSuccess || isSubmitting || !!intention.correction;

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
            <CapaciteConstanteSection intention={intention} />
            <RaisonField campagne={campagne} disabled={isCorrectionDisabled} />
            <Flex direction={"column"}>
              {isRaisonModificationCapacite() ? (
                <Text color="info.text">
                  Vous vous apprêtez à enregistrer de nouvelles capacités sur cette intention.
                </Text>
              ) : isRaisonAnnulation() ? (
                <Text color="info.text">Annuler la intention indique que le projet ne sera pas mis en oeuvre.</Text>
              ) : isRaisonReport() ? (
                <Text color="info.text">
                  Reporter la intention indique que le projet sera mis en oeuvre ultérieurement. Une nouvelle saisie ou
                  une duplication devront avoir lieu lors d’une prochaine campagne.
                </Text>
              ) : null}
              <Text fontSize={14} color={"info.text"} mb={4}>
                Pour rappel : ces modifications ne seront pas prises en compte dans le taux de transformation affiché
                dans la page de pilotage.
              </Text>
              <Collapse in={isRaisonModificationCapacite()} unmountOnExit>
                <CapaciteSection intention={intention} disabled={isCorrectionDisabled} />
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
                            correction
                          },
                        });
                      }
                      return submitCorrection({
                        body: {
                          correction: {
                            ...intention,
                            ...correction,
                            capaciteScolaireActuelle: intention.capaciteScolaireActuelle ?? 0,
                            capaciteScolaire: intention.capaciteScolaireActuelle ?? 0,
                            capaciteApprentissageActuelle: intention.capaciteApprentissageActuelle ?? 0,
                            capaciteApprentissage: intention.capaciteApprentissageActuelle ?? 0,
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
