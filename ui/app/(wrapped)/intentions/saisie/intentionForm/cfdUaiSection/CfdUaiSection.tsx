import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  DarkMode,
  Divider,
  Flex,
  Heading,
  IconButton,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { client } from "@/api.client";

import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";
import { CfdBlock } from "./CfdBlock";
import { DispositifBlock } from "./DispositifBlock";
import { LibelleFCILField } from "./LibelleFCILField";
import { UaiBlock } from "./UaiBlock";

const TagDemande = ({ status }: { status?: string }) => {
  switch (status) {
    case "draft":
      return (
        <Tag size="md" colorScheme={"yellow"} ml={4}>
          Projet de demande
        </Tag>
      );
    case "submitted":
      return (
        <Tag size="md" colorScheme={"green"} ml={4}>
          Demande validée
        </Tag>
      );
    case "refused":
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

export const CfdUaiSection = ({
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
  formId?: string;
  active: boolean;
  disabled?: boolean;
  defaultValues: PartialIntentionForms;
  formMetadata?: (typeof client.infer)["[GET]/demande/:id"]["metadata"];
  onEditUaiCfdSection: () => void;
  isFCIL: boolean;
  setIsFCIL: (isFcil: boolean) => void;
  submitCFDUAISection: () => void;
  isCFDUaiSectionValid: (_: Partial<IntentionForms>) => boolean;
  statusComponentRef?: React.RefObject<HTMLDivElement>;
}) => {
  const { watch, getValues } = useFormContext<IntentionForms>();

  const [dispositifs, setDispositifs] = useState<
    | (typeof client.infer)["[GET]/diplome/search/:search"][number]["dispositifs"]
    | undefined
  >(formMetadata?.formation?.dispositifs);

  const uai = watch("uai");

  const [uaiInfo, setUaiInfo] = useState<
    | (typeof client.infer)["[GET]/etablissement/search/:search"][number]
    | undefined
  >(
    formMetadata?.etablissement?.libelle && uai
      ? {
          label: formMetadata?.etablissement.libelle,
          value: uai,
          commune: formMetadata?.etablissement.commune,
        }
      : undefined
  );

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    watch(() => {
      setIsSubmitDisabled(!isCFDUaiSectionValid(getValues()));
    }).unsubscribe;
  });

  const anchorToStatus = () => {
    statusComponentRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DarkMode>
      <Box
        color="chakra-body-text"
        bg="blueecume.400_hover"
        p="6"
        borderRadius="6"
      >
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          {formId ? `Demande n° ${formId}` : "Nouvelle demande"}
          <TagDemande status={defaultValues.status} />
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
        </Heading>
        <Divider pt="4" mb="4" />
        <CfdBlock
          formMetaData={formMetadata}
          setDispositifs={setDispositifs}
          setIsFCIL={setIsFCIL}
          active={active}
        />
        <DispositifBlock options={dispositifs} active={active} />
        {isFCIL && <LibelleFCILField active={active}></LibelleFCILField>}
        <Flex flexDirection={"row"} justifyContent={"space-between"}>
          <Flex flexDirection="column" w="100%" maxW="752px">
            <Box mb="auto" w="100%" maxW="752px">
              <UaiBlock
                formMetadata={formMetadata}
                active={active}
                setUaiInfo={setUaiInfo}
              />
            </Box>
            <Flex
              minH={16}
              mt={"auto"}
              align="flex-end"
              justifyContent={"space-between"}
            >
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
          <Box
            bg="rgba(255,255,255,0.1)"
            p="4"
            flex="1"
            w="100%"
            minH={150}
            h="100%"
            ms={8}
            mt={8}
          >
            {!uaiInfo && <Text>Veuillez sélectionner un établissement.</Text>}
            {uaiInfo && (
              <>
                <Badge mb="2" colorScheme="green">
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
