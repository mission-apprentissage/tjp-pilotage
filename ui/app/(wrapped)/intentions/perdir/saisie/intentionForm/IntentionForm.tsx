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
  Grid,
  GridItem,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { isAxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { hasRole } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { escapeString } from "shared/utils/escapeString";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import { client } from "@/api.client";
import { Conseils } from "@/app/(wrapped)/intentions/perdir/saisie/components/Conseils";
import { MenuFormulaire } from "@/app/(wrapped)/intentions/perdir/saisie/components/MenuFormulaire";
import type { Campagne } from "@/app/(wrapped)/intentions/perdir/saisie/types";
import { SCROLL_OFFSET, STICKY_OFFSET } from "@/app/(wrapped)/intentions/perdir/SCROLL_OFFSETS";
import { getStepWorkflow } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { isTypeAjustement, isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LinkButton } from "@/components/LinkButton";
import { useAuth } from "@/utils/security/useAuth";

import { CampagneContext } from "./CampagneContext";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import type { IntentionForms, PartialIntentionForms } from "./defaultFormValues";
import { InformationsBlock } from "./InformationsBlock";
import { useIntentionFilesContext } from "./observationsSection/filesSection/filesContext";

export const IntentionForm = ({
  disabled = true,
  formId,
  defaultValues,
  formMetadata,
  campagne,
}: {
  disabled?: boolean;
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: (typeof client.infer)["[GET]/intention/:numero"]["metadata"];
  campagne?: Campagne;
}) => {
  const { auth } = useAuth();
  const toast = useToast();
  const { push } = useRouter();
  const pathname = usePathname();
  const { handleFiles } = useIntentionFilesContext();

  const { setCampagne } = useContext(CampagneContext);
  const campagneValue = useMemo(() => ({ campagne, setCampagne }), [campagne]);

  const form = useForm<IntentionForms>({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { getValues, handleSubmit } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmitting,
    mutateAsync: submitDemande,
    isSuccess,
  } = client.ref("[POST]/intention/submit").useMutation({
    onSuccess: async (body) => {
      let message = undefined;
      switch (body.statut) {
      case DemandeStatutEnum["brouillon"]:
        message = "Votre demande a bien été enregistrée en tant que brouillon";
        break;
      case DemandeStatutEnum["proposition"]:
        message = "Votre proposition a bien été enregistrée";
        break;
      case DemandeStatutEnum["projet de demande"]:
        message = "Votre projet de demande a bien été enregistré";
        break;
      default:
        message = "Votre demande a bien été enregistrée";
        break;
      }

      if (message) {
        toast({
          variant: "left-accent",
          title: message,
        });
      }

      await handleFiles(body.numero);

      push(`/intentions/perdir/saisie`);
    },
    onError: (e: unknown) => {
      if (isAxiosError<{ errors: Record<string, string> }>(e)) {
        const errors = e.response?.data?.errors ?? {
          erreur: "Une erreur est survenue lors de la sauvegarde.",
        };

        setErrors(errors);
      }
    },
  });

  const [isFCIL, setIsFCIL] = useState<boolean>(formMetadata?.formation?.isFCIL ?? false);

  const isDisabledForPerdir =
    hasRole({
      user: auth?.user,
      role: "perdir",
    }) &&
    !!defaultValues.statut &&
    getStepWorkflow(defaultValues.statut) > 1;

  const isActionsDisabled = isSuccess || isSubmitting || isDisabledForPerdir;

  const isFormDisabled =
    disabled || campagneValue.campagne?.statut !== CampagneStatutEnum["en cours"] || isDisabledForPerdir;

  const isCFDUaiSectionValid = ({ cfd, codeDispositif, libelleFCIL, uai }: Partial<IntentionForms>): boolean => {
    if (isFCIL) return !!(cfd && codeDispositif && libelleFCIL && uai);
    return !!(cfd && codeDispositif && uai);
  };

  const [step, setStep] = useState(isCFDUaiSectionValid(getValues()) ? 2 : 1);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  const onEditUaiCfdSection = () => setStep(1);

  useEffect(() => {
    if (isCFDUaiSectionValid(getValues())) {
      submitCFDUAISection();
    }
  }, []);

  const submitCFDUAISection = () => {
    if (step !== 2)
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    setStep(2);
  };

  const statutComponentRef = useRef<HTMLDivElement>(null);

  const typeDemandeRef = useRef<HTMLDivElement>(null);
  const motifsEtPrecisionsRef = useRef<HTMLDivElement>(null);
  const ressourcesHumainesRef = useRef<HTMLDivElement>(null);
  const travauxEtEquipementsRef = useRef<HTMLDivElement>(null);
  const internatEtRestaurationRef = useRef<HTMLDivElement>(null);
  const commentaireEtPiecesJointesRef = useRef<HTMLDivElement>(null);

  const anchorsRefs = {
    typeDemande: typeDemandeRef,
    motifsEtPrecisions: motifsEtPrecisionsRef,
    ressourcesHumaines: ressourcesHumainesRef,
    travauxEtEquipements: travauxEtEquipementsRef,
    internatEtRestauration: internatEtRestaurationRef,
    commentaireEtPiecesJointes: commentaireEtPiecesJointesRef,
  } as Record<string, React.RefObject<HTMLDivElement>>;

  const typeDemande = form.watch("typeDemande");
  const isTypeDemandeNotFermetureOuDiminution =
    !!typeDemande && !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

  const getStatutSubmit = (
    statutActuel?: Exclude<DemandeStatutType, "supprimée">
  ): Exclude<DemandeStatutType, "supprimée"> => {
    if (hasRole({ user: auth?.user, role: "perdir" }) || hasRole({ user: auth?.user, role: "expert_region" })) {
      return DemandeStatutEnum["proposition"];
    }
    if (isTypeAjustement(typeDemande)) {
      return DemandeStatutEnum["demande validée"];
    }
    if (statutActuel) return statutActuel;
    return DemandeStatutEnum["projet de demande"];
  };

  const getLabelSubmit = (
    statut: Exclude<DemandeStatutType, "supprimée">,
    statutPrecedent?: Exclude<DemandeStatutType, "supprimée">
  ): string => {
    if (statut === DemandeStatutEnum["projet de demande"] || statut === DemandeStatutEnum["demande validée"]) {
      return "Valider mon projet de demande";
    }
    if (!statutPrecedent || statutPrecedent === DemandeStatutEnum["brouillon"]) {
      return "Enregistrer ma proposition";
    }
    if (statut === DemandeStatutEnum["proposition"]) {
      return "Mettre à jour ma proposition";
    }
    return "Enregistrer ma proposition";
  };

  const canSubmitBrouillon = (statut?: Exclude<DemandeStatutType, "supprimée">): boolean => {
    if (hasRole({ user: auth?.user, role: "perdir" }) || hasRole({ user: auth?.user, role: "expert_region" })) {
      return statut === undefined || statut === DemandeStatutEnum["brouillon"];
    }
    return false;
  };

  return (
    <CampagneContext.Provider value={campagneValue}>
      <FormProvider {...form}>
        <Box
          ref={step1Ref}
          scrollMarginTop={SCROLL_OFFSET}
          bg="blueecume.925"
          as="form"
          noValidate
          onSubmit={handleSubmit((values) =>
            submitDemande({
              body: {
                intention: {
                  numero: formId,
                  ...values,
                  commentaire: escapeString(values.commentaire),
                  autreMotif: escapeString(values.autreMotif),
                  autreMotifRefus: escapeString(values.autreMotifRefus),
                },
              },
            })
          )}
        >
          <Container maxW={"container.xl"} pt="4" mb={24}>
            <Breadcrumb
              ml={4}
              mb={4}
              pages={[
                { title: "Accueil", to: "/" },
                { title: "Recueil des demandes", to: "/intentions" },
                pathname === "/intentions/perdir/saisie/new"
                  ? {
                    title: "Nouvelle demande",
                    to: "/intentions/perdir/saisie/new",
                    active: true,
                  }
                  : {
                    title: `Demande n°${formId}`,
                    to: `/intentions/perdir/saisie/${formId}`,
                    active: true,
                  },
              ]}
            />
            <CfdUaiSection
              formId={formId}
              defaultValues={defaultValues}
              formMetadata={formMetadata}
              onEditUaiCfdSection={onEditUaiCfdSection}
              active={step === 1}
              disabled={isFormDisabled}
              isFCIL={isFCIL}
              setIsFCIL={setIsFCIL}
              isCFDUaiSectionValid={isCFDUaiSectionValid}
              submitCFDUAISection={submitCFDUAISection}
              statutComponentRef={statutComponentRef}
              campagne={campagne}
            />
            {step === 2 && (
              <Box>
                <Grid templateColumns={"repeat(3, 1fr)"} columnGap={8}>
                  <GridItem>
                    <Box position="sticky" z-index="sticky" top={STICKY_OFFSET} textAlign={"start"}>
                      <MenuFormulaire
                        refs={anchorsRefs}
                        isTypeDemandeNotFermetureOuDiminution={isTypeDemandeNotFermetureOuDiminution}
                      />
                      <Box position="relative">
                        <Conseils />
                      </Box>
                      <Box position={"relative"}>
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
                  </GridItem>
                  <GridItem colSpan={2} ref={step2Ref} scrollMarginTop={SCROLL_OFFSET}>
                    <InformationsBlock
                      refs={anchorsRefs}
                      formId={formId}
                      disabled={isFormDisabled}
                      campagne={campagne}
                      footerActions={
                        <Flex direction="row" gap={4} ref={statutComponentRef}>
                          {canSubmitBrouillon() && (
                            <Button
                              isDisabled={
                                disabled || isActionsDisabled || campagne?.statut !== CampagneStatutEnum["en cours"]
                              }
                              isLoading={isSubmitting}
                              variant="draft"
                              onClick={handleSubmit((values) =>
                                submitDemande({
                                  body: {
                                    intention: {
                                      numero: formId,
                                      ...values,
                                      statut: DemandeStatutEnum["brouillon"],
                                      campagneId: values.campagneId ?? campagne?.id,
                                      commentaire: escapeString(values.commentaire),
                                      autreMotif: escapeString(values.autreMotif),
                                      autreMotifRefus: escapeString(values.autreMotifRefus),
                                    },
                                  },
                                })
                              )}
                              leftIcon={<CheckIcon />}
                            >
                              Enregistrer en tant que brouillon
                            </Button>
                          )}
                          <Button
                            isDisabled={
                              disabled || isActionsDisabled || campagne?.statut !== CampagneStatutEnum["en cours"]
                            }
                            isLoading={isSubmitting}
                            variant="primary"
                            onClick={handleSubmit((values) =>
                              submitDemande({
                                body: {
                                  intention: {
                                    numero: formId,
                                    ...values,
                                    statut: getStatutSubmit(values.statut),
                                    campagneId: values.campagneId ?? campagne?.id,
                                    commentaire: escapeString(values.commentaire),
                                    autreMotif: escapeString(values.autreMotif),
                                    autreMotifRefus: escapeString(values.autreMotifRefus),
                                  },
                                },
                              })
                            )}
                            leftIcon={<CheckIcon />}
                          >
                            {getLabelSubmit(getStatutSubmit(defaultValues.statut), defaultValues.statut)}
                          </Button>
                        </Flex>
                      }
                    />
                    <LinkButton
                      mt={6}
                      leftIcon={<Icon icon="ri:arrow-up-fill" />}
                      onClick={() =>
                        step1Ref.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    >
                      Haut de page
                    </LinkButton>
                  </GridItem>
                </Grid>
              </Box>
            )}
          </Container>
        </Box>
      </FormProvider>
    </CampagneContext.Provider>
  );
};
