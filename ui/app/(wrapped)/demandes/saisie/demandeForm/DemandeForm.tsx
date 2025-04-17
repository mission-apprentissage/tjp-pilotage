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
import { useRouter, useSearchParams} from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {hasRole, RoleEnum} from 'shared';
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import { escapeString } from "shared/utils/escapeString";
import { isStatutBrouillon, isStatutDemandeValidee, isStatutProjetDeDemande, isStatutProposition } from "shared/utils/statutDemandeUtils";
import { isTypeAjustement, isTypeDiminution, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { client } from "@/api.client";
import { Conseils } from "@/app/(wrapped)/demandes/saisie/components/Conseils";
import { MenuFormulaire } from "@/app/(wrapped)/demandes/saisie/components/MenuFormulaire";
import { SCROLL_OFFSET, STICKY_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";
import type { Demande, DemandeMetadata } from "@/app/(wrapped)/demandes/types";
import {canCorrectDemande} from '@/app/(wrapped)/demandes/utils/permissionsDemandeUtils';
import { getStepWorkflow } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LinkButton } from "@/components/LinkButton";
import type { DetailedApiError } from "@/utils/apiError";
import { getDetailedErrorMessage } from "@/utils/apiError";
import {getRoutingSaisieRecueilDemande} from '@/utils/getRoutingRecueilDemande';
import { useAuth } from "@/utils/security/useAuth";

import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import { InformationsBlock } from "./InformationsBlock";
import { useDemandeFilesContext } from "./observationsSection/filesSection/filesContext";
import type { DemandeFormType, PartialDemandeFormType } from "./types";

export const DemandeForm = ({
  disabled,
  formId,
  defaultValues,
  formMetadata,
  campagne,
  demande
}: {
  disabled?: boolean;
  formId?: string;
  defaultValues: PartialDemandeFormType;
  formMetadata?: DemandeMetadata;
  campagne: CampagneType;
  demande?: Demande;
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const { push } = useRouter();
  const { handleFiles } = useDemandeFilesContext();

  const form = useForm<DemandeFormType>({
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
  } = client.ref("[POST]/demande/submit").useMutation({
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

      push(`/demandes/saisie`);
    },
    onError: (e: unknown) => {
      if(isAxiosError<DetailedApiError>(e)) {
        setErrors(() => ({ ...getDetailedErrorMessage(e) }));
      }
    },
  });

  const [isFCIL, setIsFCIL] = useState<boolean>(formMetadata?.formation?.isFCIL ?? false);
  const [dateFermetureFormation, setDateFermetureFormation] =
    useState<string | undefined>(formMetadata?.formation?.dateFermeture);

  const isDisabledForPerdir =
    hasRole({
      user,
      role: RoleEnum["perdir"],
    }) &&
    !!defaultValues.statut &&
    getStepWorkflow(defaultValues.statut) > 1;

  const isActionsDisabled = isSuccess || isSubmitting || isDisabledForPerdir;

  const isFormDisabled =
    disabled || campagne.statut !== CampagneStatutEnum["en cours"] || isDisabledForPerdir;

  const isCFDUaiSectionValid = ({ cfd, codeDispositif, libelleFCIL, uai }: PartialDemandeFormType): boolean => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const correctionRef = useRef<HTMLDivElement>(null);

  const anchorsRefs = {
    typeDemande: typeDemandeRef,
    motifsEtPrecisions: motifsEtPrecisionsRef,
    ressourcesHumaines: ressourcesHumainesRef,
    travauxEtEquipements: travauxEtEquipementsRef,
    internatEtRestauration: internatEtRestaurationRef,
    commentaireEtPiecesJointes: commentaireEtPiecesJointesRef,
    correction: correctionRef,
  } as Record<string, React.RefObject<HTMLDivElement>>;

  const typeDemande = form.watch("typeDemande");
  const isTypeDemandeNotFermetureOuDiminution =
    !!typeDemande && !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

  const getStatutSubmit = (
    statutActuel?: Exclude<DemandeStatutType, "supprimée">
  ): Exclude<DemandeStatutType, "supprimée"> => {
    if (hasRole({ user, role: RoleEnum["perdir"] }) || hasRole({ user, role: RoleEnum["expert_region"] })) {
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
    if (isStatutDemandeValidee(statut)) return "Valider mon projet de demande";
    if (isStatutProjetDeDemande(statut)) return "Enregistrer mon projet de demande";
    if (!statutPrecedent || isStatutBrouillon(statutPrecedent)) return "Enregistrer ma proposition";
    if (isStatutProposition(statut)) return "Mettre à jour ma proposition";
    return "Enregistrer ma proposition";
  };

  const canSubmitBrouillon = (statut?: Exclude<DemandeStatutType, "supprimée">): boolean => {
    if (hasRole({ user, role: RoleEnum["perdir"] }) || hasRole({ user, role: RoleEnum["expert_region"] })) {
      return statut === undefined || statut === DemandeStatutEnum["brouillon"];
    }
    return false;
  };

  const queryParams = useSearchParams();
  const isCorrection = !!queryParams.get("correction");
  const showCorrection = isCorrection && canCorrectDemande({demande, user});

  return (
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
              demande: {
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
              { title: "Recueil des demandes", to: getRoutingSaisieRecueilDemande({user}) },
              formId
                ?  {
                  title: `Demande n°${formId}`,
                  to: getRoutingSaisieRecueilDemande({user, suffix: formId}),
                  active: true,
                }
                : {
                  title: "Nouvelle demande",
                  to: getRoutingSaisieRecueilDemande({user, suffix: "new"}),
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
            disabled={disabled}
            isFCIL={isFCIL}
            setIsFCIL={setIsFCIL}
            setDateFermetureFormation={setDateFermetureFormation}
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
                      showCorrection={showCorrection}
                    />
                    <Box position="relative">
                      <Conseils dateFermetureFormation={dateFermetureFormation} />
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
                    demande={demande}
                    showCorrection={showCorrection}
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
                                  demande: {
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
                                demande: {
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
  );
};
