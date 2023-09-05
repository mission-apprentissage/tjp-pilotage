import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  DarkMode,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select, {
  CSSObjectWithLabel,
  InputActionMeta,
  SingleValue,
} from "react-select";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { IntentionForms } from "./defaultFormValues";

export const UaiBlock = ({
  active,
  onSubmit,
  onOpen,
  defaultValues,
  checkUaiData,
}: {
  active: boolean;
  onSubmit: (values: IntentionForms[1]) => void;
  onOpen: () => void;
  defaultValues: IntentionForms[1];
  checkUaiData?: ApiType<typeof api.checkUai> | { status: "wrong_format" };
}) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const [searchEtabInput, setSearchEtabInput] = useState<string>("");

  useEffect(() => {
    if (defaultValues.searchEtab) {
      setSearchEtabInput(defaultValues.searchEtab);
      onSubmit({ searchEtab: defaultValues.searchEtab });
    }
  }, []);

  const { data: etabOptions, isLoading: isEtabOptionsLoading } = useQuery({
    keepPreviousData: false,
    staleTime: 1000,
    queryKey: ["searchEtab", searchEtabInput],
    enabled: searchEtabInput.length >= 3,
    queryFn: api.searchEtab({ params: { search: searchEtabInput } }).call,
  });

  const handleInputChange = (inputText: string, meta: InputActionMeta) => {
    if (meta.action !== "input-blur" && meta.action !== "menu-close") {
      setSearchEtabInput(inputText);
    }
  };

  const colourStyles = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      backgroundColor: "white",
    }),
    option: (styles: CSSObjectWithLabel) => {
      return {
        ...styles,
        color: "#000",
      };
    },
  };

  return (
    <DarkMode>
      <Box
        color="chakra-body-text"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="#5770BE"
        p="6"
        borderRadius="6"
      >
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          Nouvelle demande
          <IconButton
            visibility={active ? "collapse" : "visible"}
            variant="ghost"
            ml="auto"
            aria-label="Editer"
            onClick={() => {
              onOpen();
              setSearchEtabInput("");
            }}
          >
            <EditIcon />
          </IconButton>
        </Heading>
        <Divider pt="4" mb="4" />
        <Flex align="flex-end">
          <Box
            bg="rgba(255,255,255,0.1)"
            p="4"
            mr="8"
            flex="1"
            maxW="400"
            minH={150}
          >
            {!checkUaiData && !defaultValues.searchEtab && (
              <Text>Veuillez saisir le numéro établissement.</Text>
            )}
            {!checkUaiData && defaultValues.searchEtab && (
              <Text>Veuillez valider le numéro établissement.</Text>
            )}
            {checkUaiData?.status === "wrong_format" && (
              <>
                <Badge mb="2" colorScheme="red">
                  Format incorrect
                </Badge>
                <Text>Le numéro d'établissment n'est pas au bon format.</Text>
              </>
            )}
            {checkUaiData?.status === "not_found" && (
              <>
                <Badge colorScheme="red">Établissement non trouvé</Badge>
              </>
            )}
            {checkUaiData?.status === "valid" && (
              <>
                <Badge mb="2" colorScheme="green">
                  Établissement validé
                </Badge>
                <Text fontSize="sm">{checkUaiData.data.libelle}</Text>
                <Text fontSize="sm" mt="1">
                  {checkUaiData.data.commune}
                </Text>
              </>
            )}
          </Box>
          <FormControl
            mr="8"
            flex="1"
            maxW="480px"
            isInvalid={!!errors.searchEtab}
          >
            <FormLabel>Recherche d'un établissement</FormLabel>
            <Controller
              name="searchEtab"
              control={control}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <Select
                  name={name}
                  styles={colourStyles}
                  onChange={(
                    selectedUai: SingleValue<{ label: string; value: string }>
                  ) => {
                    if (selectedUai) {
                      onChange(selectedUai.value);
                      onSubmit({ searchEtab: selectedUai.value });
                    }
                  }}
                  onBlur={onBlur}
                  value={etabOptions?.find((uai) => uai.value === value)}
                  options={etabOptions}
                  filterOption={null}
                  onInputChange={handleInputChange}
                  isLoading={isEtabOptionsLoading}
                  loadingMessage={() => "Recherche..."}
                  isClearable={true}
                  noOptionsMessage={() => "Pas d'établissement correspondant"}
                  placeholder="UAI, nom, commune"
                  isDisabled={!active}
                  blurInputOnSelect
                  autoFocus
                  closeMenuOnSelect={false}
                />
              )}
            />
          </FormControl>
        </Flex>
      </Box>
    </DarkMode>
  );
};
