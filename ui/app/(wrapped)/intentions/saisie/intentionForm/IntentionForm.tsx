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
  Grid,
  GridItem,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { isAxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";
import { escapeString } from "shared/utils/escapeString";

import { client } from "@/api.client";
import { isTypeAjustement } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { Breadcrumb } from "@/components/Breadcrumb";

import { Conseils } from "../components/Conseils";
import { MenuFormulaire } from "../components/MenuFormulaire";
import { SCROLL_OFFSET, STICKY_OFFSET } from "../SCROLL_OFFSETS";
import { Campagne, Demande } from "../types";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
import { IntentionForms, PartialIntentionForms } from "./defaultFormValues";
import { InformationsBlock } from "./InformationsBlock";

export const CampagneContext = createContext<{
  campagne?: Campagne;
  setCampagne: Dispatch<SetStateAction<Campagne>>;
}>({
  campagne: undefined,
  setCampagne: () => {},
});

export const IntentionForm = ({
  disabled = true,
  formId,
  defaultValues,
  formMetadata,
  campagne,
  demande,
}: {
  disabled?: boolean;
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
  campagne?: Campagne;
  demande?: Demande;
}) => {
  const toast = useToast();
  const { push } = useRouter();
  const pathname = usePathname();
  const form = useForm<IntentionForms>({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
    disabled: campagne?.statut !== CampagneStatutEnum["en cours"],
  });

  const { getValues, handleSubmit } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmitting,
    mutateAsync: submitDemande,
    isSuccess,
  } = client.ref("[POST]/demande/submit").useMutation({
    onSuccess: (body) => {
      push(`/intentions/saisie`);

      let message: string | null = null;

      switch (body.statut) {
        case DemandeStatutEnum["projet de demande"]:
          message = "Projet de demande enregistré avec succès";
          break;
        case DemandeStatutEnum["demande validée"]:
          message = "Demande validée avec succès";
          break;
        case DemandeStatutEnum["refusée"]:
          message = "Demande refusée avec succès";
          break;
        case DemandeStatutEnum["supprimée"]:
          message = "Demande supprimée avec succès";
          break;
      }

      if (message) {
        toast({
          variant: "left-accent",
          title: message,
        });
      }
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

  const isActionsDisabled = isSuccess || isSubmitting;

  const [isFCIL, setIsFCIL] = useState<boolean>(
    formMetadata?.formation?.isFCIL ?? false
  );

  const isFormDisabled = disabled || form.formState.disabled;

  const isCFDUaiSectionValid = ({
    cfd,
    codeDispositif,
    libelleFCIL,
    uai,
  }: Partial<IntentionForms>): boolean => {
    if (isFCIL) return !!(cfd && codeDispositif && libelleFCIL && uai);
    return !!(cfd && codeDispositif && uai);
  };

  const [step, setStep] = useState(isCFDUaiSectionValid(getValues()) ? 2 : 1);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  const onEditUaiCfdSection = () => setStep(1);

  const getStatutSubmit = (
    demande: (typeof client.inferArgs)["[POST]/demande/submit"]["body"]["demande"]
  ): Exclude<DemandeStatutType, "supprimée"> => {
    if (isTypeAjustement(demande.typeDemande))
      return DemandeStatutEnum["demande validée"];
    if (formId) return demande.statut;
    return DemandeStatutEnum["projet de demande"];
  };

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

  const statusComponentRef = useRef<HTMLDivElement>(null);

  const { setCampagne } = useContext(CampagneContext);

  const campagneValue = useMemo(() => ({ campagne, setCampagne }), [campagne]);

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
                { title: "Recueil des demandes", to: "/intentions" },
                pathname === "/intentions/saisie/new"
                  ? {
                      title: "Nouvelle demande",
                      to: "/intentions/saisie/new",
                      active: true,
                    }
                  : {
                      title: `Demande n°${formId}`,
                      to: `/intentions/saisie/${formId}`,
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
              statusComponentRef={statusComponentRef}
              campagne={campagne}
            />
            {step === 2 && (
              <Box ref={step2Ref}>
                <Grid templateColumns={"repeat(3, 1fr)"} columnGap={8}>
                  <GridItem>
                    <Box
                      position="sticky"
                      z-index="sticky"
                      top={STICKY_OFFSET}
                      textAlign={"start"}
                    >
                      <MenuFormulaire refs={anchorsRefs} />
                      <Box position="relative">
                        <Conseils />
                      </Box>
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
                  </GridItem>
                  <GridItem colSpan={2}>
                    <InformationsBlock
                      refs={anchorsRefs}
                      formId={formId}
                      disabled={isFormDisabled}
                      campagne={campagne}
                      demande={demande}
                      footerActions={
                        <Box justifyContent={"center"} ref={statusComponentRef}>
                          <Button
                            isDisabled={
                              disabled ||
                              isActionsDisabled ||
                              campagne?.statut !==
                                CampagneStatutEnum["en cours"]
                            }
                            isLoading={isSubmitting}
                            variant="primary"
                            onClick={handleSubmit((values) =>
                              submitDemande({
                                body: {
                                  demande: {
                                    numero: formId,
                                    ...values,
                                    statut: getStatutSubmit(values),
                                    campagneId:
                                      values.campagneId ?? campagne?.id,
                                    commentaire: escapeString(
                                      values.commentaire
                                    ),
                                    autreMotif: escapeString(values.autreMotif),
                                    autreMotifRefus: escapeString(
                                      values.autreMotifRefus
                                    ),
                                  },
                                },
                              })
                            )}
                            leftIcon={<CheckIcon />}
                          >
                            {formId
                              ? "Sauvegarder les modifications"
                              : "Enregistrer le projet de demande"}
                          </Button>
                        </Box>
                      }
                    />
                    <Button
                      variant={"ghost"}
                      mt={6}
                      borderRadius={"unset"}
                      borderBottom={"1px solid"}
                      borderColor={"bluefrance.113"}
                      color={"bluefrance.113"}
                      _hover={{
                        backgroundColor: "unset",
                      }}
                      p={1}
                      h="fit-content"
                      fontWeight={400}
                      fontSize={16}
                      leftIcon={<Icon icon="ri:arrow-up-fill" />}
                      onClick={() =>
                        step1Ref.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    >
                      Haut de page
                    </Button>
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
