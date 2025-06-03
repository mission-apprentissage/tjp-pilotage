import { EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, DarkMode, Divider, Flex, Heading, IconButton, Tag, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";

import { StatutTag } from "@/app/(wrapped)/demandes/components/StatutTag";
import type {
  DemandeFormType,
  PartialDemandeFormType,
} from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import type { DemandeMetadata, Etablissement, Formation } from '@/app/(wrapped)/demandes/types';

import { CfdBlock } from "./CfdBlock";
import { DispositifBlock } from "./DispositifBlock";
import { LibelleFCILField } from "./LibelleFCILField";
import { UaiBlock } from "./UaiBlock";

const TagCampagne = ({ campagne }: { campagne?: CampagneType }) => {
  if (!campagne) return null;
  switch (campagne.statut) {
  case CampagneStatutEnum["en cours"]:
    return (
      <Tag size="md" color={"success.425"} bgColor={"success.950"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  case CampagneStatutEnum["en attente"]:
    return (
      <Tag size="md" ml={4} bgColor={"purpleGlycine.950"} color={"purpleGlycine.319"}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  case CampagneStatutEnum["terminée"]:
    return (
      <Tag size="md" ml={4} color={"error.425"} bgColor={"error.950"}>
          Campagne {campagne.annee} ({campagne.statut})
      </Tag>
    );
  default:
    return (
      <Tag size="md" ml={4} color={"yellowTournesol.407"} bgColor={"yellowTournesol.950"}>
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
  setDateFermetureFormation,
  submitCFDUAISection,
  isCFDUaiSectionValid,
  statutComponentRef,
}: {
  campagne?: CampagneType;
  formId?: string;
  active: boolean;
  disabled?: boolean;
  defaultValues: PartialDemandeFormType;
  formMetadata?: DemandeMetadata;
  onEditUaiCfdSection: () => void;
  isFCIL: boolean;
  setIsFCIL: (isFcil: boolean) => void;
  setDateFermetureFormation: (dateFermetureFormation?: string) => void;
  submitCFDUAISection: () => void;
  isCFDUaiSectionValid: (_: Partial<DemandeFormType>) => boolean;
  statutComponentRef?: React.RefObject<HTMLDivElement>;
}) => {
  const { watch, getValues } = useFormContext<DemandeFormType>();

  const [dispositifs, setDispositifs] = useState<Formation["dispositifs"] | undefined
      >(formMetadata?.formation?.dispositifs);

  const uai = watch("uai");

  const [uaiInfo, setUaiInfo] = useState<Etablissement | undefined
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
    statutComponentRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DarkMode>
      <Box color="chakra-body-text" bg="blueecume.400_hover" p="6" borderRadius="6">
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          {formId ? `Demande n° ${formId}` : "Nouvelle demande"}
          <TagCampagne campagne={campagne} />
          <StatutTag statut={defaultValues.statut ?? DemandeStatutEnum["brouillon"]} ml={4} size={"md"} />
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
          setDateFermetureFormation={setDateFermetureFormation}
          disabled={disabled || !active}
          campagne={campagne}
        />
        <DispositifBlock options={dispositifs} disabled={disabled || !active} />
        <LibelleFCILField shouldDisplay={isFCIL} disabled={disabled || !active} />
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction="column" w="100%" maxW="752px" gap={4}>
            <Box w="100%" maxW="752px">
              <UaiBlock formMetadata={formMetadata} disabled={disabled || !active} setUaiInfo={setUaiInfo} />
            </Box>
            <Flex minH={16} align="flex-end" justify={"space-between"}>
              {!disabled && (
                <Button
                  visibility={active ? "collapse" : "visible"}
                  ms="auto"
                  mb="auto"
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
