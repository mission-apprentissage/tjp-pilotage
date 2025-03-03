import { EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, DarkMode, Divider, Flex, Heading, IconButton, Tag, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";

import type { client } from "@/api.client";
import type {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import type { DemandeMetadata } from "@/app/(wrapped)/intentions/saisie/types";

import { CfdBlock } from "./CfdBlock";
import { DispositifBlock } from "./DispositifBlock";
import { LibelleFCILField } from "./LibelleFCILField";
import { UaiBlock } from "./UaiBlock";

const TagDemande = ({ statut }: { statut?: string }) => {
  switch (statut) {
  case DemandeStatutEnum["projet de demande"]:
    return (
      <Tag size="md" colorScheme={"yellow"} ml={4}>
          Projet de demande
      </Tag>
    );
  case DemandeStatutEnum["demande validée"]:
    return (
      <Tag size="md" colorScheme={"green"} ml={4}>
          Demande validée
      </Tag>
    );
  case DemandeStatutEnum["refusée"]:
    return (
      <Tag size="md" colorScheme={"red"} ml={4}>
          Demande refusée
      </Tag>
    );
  default:
    return (
      <Tag size="md" colorScheme={"yellow"} ml={4}>
          Projet de demande
      </Tag>
    );
  }
};

const TagCampagne = ({ campagne }: { campagne?: CampagneType }) => {
  if (!campagne) return null;
  switch (campagne.statut) {
  case CampagneStatutEnum["en cours"]:
    return (
      <Tag size="md" colorScheme={"green"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  case CampagneStatutEnum["en attente"]:
    return (
      <Tag size="md" colorScheme={"purple"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  case CampagneStatutEnum["terminée"]:
    return (
      <Tag size="md" colorScheme={"red"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  default:
    return (
      <Tag size="md" colorScheme={"yellow"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  }
};

export const CfdUaiSection = ({
  campagne,
  formId,
  active,
  disabled,
  defaultValues,
  formMetadata,
  onEditUaiCfdSection,
  isFCIL,
  setIsFCIL,
  submitCFDUAISection,
  isCFDUaiSectionValid,
  statusComponentRef,
}: {
  campagne?: CampagneType;
  formId?: string;
  active: boolean;
  disabled?: boolean;
  defaultValues: PartialIntentionForms;
  formMetadata?: DemandeMetadata;
  onEditUaiCfdSection: () => void;
  isFCIL: boolean;
  setIsFCIL: (isFcil: boolean) => void;
  submitCFDUAISection: () => void;
  isCFDUaiSectionValid: (_: Partial<IntentionForms>) => boolean;
  statusComponentRef?: React.RefObject<HTMLDivElement>;
}) => {
  const { watch, getValues } = useFormContext<IntentionForms>();

  const [dispositifs, setDispositifs] = useState<
    (typeof client.infer)["[GET]/diplome/search/:search"][number]["dispositifs"] | undefined
      >(formMetadata?.formation?.dispositifs);

  const uai = watch("uai");

  const [uaiInfo, setUaiInfo] = useState<
    (typeof client.infer)["[GET]/etablissement/search/:search"][number] | undefined
      >(
      formMetadata?.etablissement?.libelleEtablissement && uai
        ? {
          label: formMetadata?.etablissement.libelleEtablissement,
          value: uai,
          commune: formMetadata?.etablissement.commune,
        }
        : undefined
      );

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    const subscription = watch(() => {
      setIsSubmitDisabled(!isCFDUaiSectionValid(getValues()));
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues, isCFDUaiSectionValid]);

  const anchorToStatus = () => {
    statusComponentRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DarkMode>
      <Box color="chakra-body-text" bg="blueecume.400_hover" p="6" borderRadius="6">
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          {formId ? `Demande n° ${formId}` : "Nouvelle demande"}
          <TagCampagne campagne={campagne} />
          <TagDemande statut={defaultValues.statut} />
          {defaultValues && (
            <IconButton
              icon={<EditIcon />}
              visibility={active ? "collapse" : "visible"}
              ml={2}
              aria-label="Editer"
              variant={"ghost"}
              onClick={() => anchorToStatus()}
            />
          )}
          {disabled && (
            <Tag size="lg" colorScheme={"red"} ml={"auto"}>
              Mode consultation
            </Tag>
          )}
        </Heading>
        <Divider pt="4" mb="4" />
        <CfdBlock
          formMetaData={formMetadata}
          setDispositifs={setDispositifs}
          setIsFCIL={setIsFCIL}
          disabled={disabled || !active}
        />
        <DispositifBlock options={dispositifs} active={active && !disabled} />
        {isFCIL && <LibelleFCILField active={active}></LibelleFCILField>}
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction="column" w="100%" maxW="752px">
            <Box mb="auto" w="100%" maxW="752px">
              <UaiBlock formMetadata={formMetadata} disabled={disabled || !active} setUaiInfo={setUaiInfo} />
            </Box>
            <Flex minH={16} mt={"auto"} align="flex-end" justify={"space-between"}>
              {!disabled && (
                <Button
                  visibility={active ? "collapse" : "visible"}
                  mr="auto"
                  aria-label="Editer"
                  onClick={onEditUaiCfdSection}
                  leftIcon={<EditIcon />}
                >
                  Modifier
                </Button>
              )}
              {active && (
                <Button
                  isDisabled={isSubmitDisabled}
                  onClick={() => submitCFDUAISection()}
                  mt={8}
                  ms="auto"
                  size="lg"
                  variant={"primary"}
                >
                  Passer à l'étape suivante
                </Button>
              )}
            </Flex>
          </Flex>
          <Box bg="rgba(255,255,255,0.1)" p="4" flex="1" w="100%" minH={150} h="100%" ms={8} mt={8}>
            {!uaiInfo && <Text>Veuillez sélectionner un établissement.</Text>}
            {uaiInfo && (
              <>
                <Badge mb="2" variant="success" size="sm" fontSize={12}>
                  Établissement validé
                </Badge>
                <Text fontSize="sm">{`Numéro UAI : ${uaiInfo.value}`}</Text>
                <Text fontSize="sm" mt="1">
                  {uaiInfo.label?.split("-")[0]}
                </Text>
                <Text fontSize="sm" mt="1">
                  {uaiInfo.commune}
                </Text>
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </DarkMode>
  );
};
