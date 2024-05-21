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
import { AxiosError } from "axios";
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
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import { client } from "@/api.client";
import { Breadcrumb } from "@/components/Breadcrumb";

import { isTypeFermeture } from "../../../utils/typeDemandeUtils";
import { SCROLL_OFFSET, STICKY_OFFSET } from "../../SCROLL_OFFSETS";
import { Conseils } from "../components/Conseils";
import { MenuFormulaire } from "../components/MenuFormulaire";
import { Campagne } from "../types";
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
}: {
  disabled?: boolean;
  formId?: string;
  defaultValues: PartialIntentionForms;
  formMetadata?: (typeof client.infer)["[GET]/intention/:numero"]["metadata"];
  campagne?: Campagne;
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
  } = client.ref("[POST]/intention/submit").useMutation({
    onSuccess: (body) => {
      push(`/intentions/perdir/saisie`);

      let message: string | null = null;

      switch (body.statut) {
        case DemandeStatutEnum["proposition"]:
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
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setErrors(errors);
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
    !!typeDemande &&
    !isTypeFermeture(typeDemande) &&
    !isTypeDiminution(typeDemande);

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
              body: { intention: { numero: formId, ...values } },
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
              statusComponentRef={statusComponentRef}
              campagne={campagne}
            />
            {step === 2 && (
              <Box>
                <Grid templateColumns={"repeat(3, 1fr)"} columnGap={8}>
                  <GridItem>
                    <Box
                      position="sticky"
                      z-index="sticky"
                      top={STICKY_OFFSET}
                      textAlign={"start"}
                    >
                      <MenuFormulaire
                        refs={anchorsRefs}
                        isTypeDemandeNotFermetureOuDiminution={
                          isTypeDemandeNotFermetureOuDiminution
                        }
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
                  <GridItem
                    colSpan={2}
                    ref={step2Ref}
                    scrollMarginTop={SCROLL_OFFSET}
                  >
                    <InformationsBlock
                      refs={anchorsRefs}
                      formId={formId}
                      disabled={isFormDisabled}
                      campagne={campagne}
                      footerActions={
                        <Flex direction="row" gap={4} ref={statusComponentRef}>
                          {defaultValues.statut !=
                            DemandeStatutEnum.proposition && (
                            <Button
                              isDisabled={
                                disabled ||
                                isActionsDisabled ||
                                campagne?.statut !==
                                  CampagneStatutEnum["en cours"]
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
                                      campagneId:
                                        values.campagneId ?? campagne?.id,
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
                                  intention: {
                                    numero: formId,
                                    ...values,
                                    statut: formId
                                      ? values.statut
                                      : DemandeStatutEnum["proposition"],
                                    campagneId:
                                      values.campagneId ?? campagne?.id,
                                  },
                                },
                              })
                            )}
                            leftIcon={<CheckIcon />}
                          >
                            Soumettre ma demande
                          </Button>
                        </Flex>
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
