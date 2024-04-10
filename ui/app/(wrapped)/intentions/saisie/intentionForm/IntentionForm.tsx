"use client";

import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Container, useToast } from "@chakra-ui/react";
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

import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { Campagne } from "@/app/(wrapped)/intentions/saisie/types";

import { client } from "../../../../../api.client";
import { Breadcrumb } from "../../../../../components/Breadcrumb";
import { CfdUaiSection } from "./cfdUaiSection/CfdUaiSection";
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
  formMetadata?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
  campagne?: Campagne;
}) => {
  const toast = useToast();
  const { push } = useRouter();
  const pathname = usePathname();
  const form = useForm<IntentionForms>({
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
    disabled: campagne?.statut != "en cours",
  });

  const { getValues, handleSubmit } = form;

  const [errors, setErrors] = useState<Record<string, string>>();

  const {
    isLoading: isSubmitting,
    mutateAsync: submitDemande,
    isSuccess: isSuccess,
  } = client.ref("[POST]/demande/submit").useMutation({
    onSuccess: (body) => {
      push(`/intentions/saisie`);

      let message: string | null = null;

      switch (body.statut) {
        case "draft":
          message = "Projet de demande enregistré avec succès";
          break;
        case "submitted":
          message = "Demande validée avec succès";
          break;
        case "refused":
          message = "Demande refusée avec succès";
          break;
        case "deleted":
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
  return (
    <>
      <CampagneContext.Provider value={campagneValue}>
        <FormProvider {...form}>
          <Box
            flex={1}
            bg="blueecume.925"
            as="form"
            noValidate
            onSubmit={handleSubmit((values) =>
              submitDemande({
                body: { demande: { numero: formId, ...values } },
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
              <Collapse in={step === 2} animateOpacity ref={step2Ref}>
                <InformationsBlock
                  formId={formId}
                  disabled={isFormDisabled}
                  errors={errors}
                  footerActions={
                    <>
                      <Box justifyContent={"center"} ref={statusComponentRef}>
                        <Button
                          isDisabled={
                            disabled ||
                            isActionsDisabled ||
                            !form.formState.isDirty ||
                            campagne?.statut != "en cours"
                          }
                          isLoading={isSubmitting}
                          variant="primary"
                          onClick={
                            // () => console.log(form.getValues())
                            handleSubmit((values) =>
                              submitDemande({
                                body: {
                                  demande: {
                                    numero: formId,
                                    ...values,
                                    statut: formId ? values.statut : "draft",
                                  },
                                },
                              })
                            )
                          }
                          leftIcon={<CheckIcon />}
                        >
                          {formId
                            ? "Sauvegarder les modifications"
                            : "Enregistrer le projet de demande"}
                        </Button>
                      </Box>
                    </>
                  }
                />
              </Collapse>
            </Container>
          </Box>
        </FormProvider>
      </CampagneContext.Provider>
    </>
  );
};
