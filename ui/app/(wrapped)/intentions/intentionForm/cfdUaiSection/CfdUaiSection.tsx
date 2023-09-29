import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  DarkMode,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "@/api.client";

import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";
import { CfdBlock } from "./CfdBlock";
import { DispositifBlock } from "./DispositifBlock";
import { LibelleFCILField } from "./LibelleFCILField";
import { UaiBlock } from "./UaiBlock";

export const CfdUaiSection = ({
  formId,
  active,
  formMetadata,
  onEditUaiCfdSection,
  isFCIL,
  setIsFCIL,
  submitCFDUAISection,
  isCFDUaiSectionValid,
}: {
  formId?: string;
  active: boolean;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  onEditUaiCfdSection: () => void;
  isFCIL: boolean;
  setIsFCIL: (isFcil: boolean) => void;
  submitCFDUAISection: () => void;
  isCFDUaiSectionValid: (_: Partial<IntentionForms>) => boolean;
}) => {
  const { watch, getValues } = useFormContext<IntentionForms>();

  const [dispositifs, setDispositifs] = useState<
    ApiType<typeof api.searchDiplome>[number]["dispositifs"] | undefined
  >(formMetadata?.formation?.dispositifs);

  const uai = watch("uai");

  const [uaiInfo, setUaiInfo] = useState<
    ApiType<typeof api.searchEtab>[number] | undefined
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

  return (
    <DarkMode>
      <Box color="chakra-body-text" bg="blue.main" p="6" borderRadius="6">
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          {formId ? `Demande n° ${formId}` : "Nouvelle demande"}
          <Button
            visibility={active ? "collapse" : "visible"}
            ml="auto"
            aria-label="Editer"
            onClick={onEditUaiCfdSection}
            leftIcon={<EditIcon />}
          >
            Modifier
          </Button>
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
            <Flex minH={16} mt={"auto"} align="flex-end">
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
