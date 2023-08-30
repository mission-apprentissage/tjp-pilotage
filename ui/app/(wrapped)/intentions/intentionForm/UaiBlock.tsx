import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  DarkMode,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { api } from "../../../../api.client";
import { IntentionForms } from "./defaultFormValues";

export const UaiRegex = /^[A-Z0-9]{8}$/;

export const UaiBlock = ({
  active,
  onSubmit,
  onOpen,
  defaultValues,
}: {
  active: boolean;
  onSubmit: (values: IntentionForms[1]) => void;
  onOpen: () => void;
  defaultValues: IntentionForms[1];
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const {
    data,
    mutateAsync: checkUai,
    reset,
    isLoading,
  } = useMutation({
    mutationFn: async (uai: string) => {
      if (!UaiRegex.test(uai)) return await { status: "wrong_format" as const };
      return await api.checkUai({ params: { uai } }).call();
    },
  });

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
              reset();
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
            {!data && !defaultValues.uai && (
              <Text>Veuillez saisir le numéro établissement.</Text>
            )}
            {!data && defaultValues.uai && (
              <Text>Veuillez valider le numéro établissement.</Text>
            )}
            {data?.status === "wrong_format" && (
              <>
                <Badge mb="2" colorScheme="red">
                  Format incorrect
                </Badge>
                <Text>Le numéro d'établissment n'est pas au bon format.</Text>
              </>
            )}
            {data?.status === "not_found" && (
              <>
                <Badge colorScheme="red">Établissement non trouvé</Badge>
              </>
            )}
            {data?.status === "valid" && (
              <>
                <Badge mb="2" colorScheme="green">
                  Établissement validé
                </Badge>
                <Text fontSize="sm">{data.data.libelle}</Text>
                <Text fontSize="sm" mt="1">
                  {data.data.commune}
                </Text>
              </>
            )}
          </Box>
          <FormControl mr="8" flex="1" maxW="280px" isInvalid={!!errors.uai}>
            <FormLabel>Numéro UAI de l'établissement</FormLabel>
            <Input
              {...register("uai", {
                disabled: !active,
                validate: async (uai) => {
                  if (!uai) return false;
                  const validation = await checkUai(uai);
                  if (validation.status === "valid") {
                    return true;
                  } else {
                    return "Le code UAI est introuvable";
                  }
                },
              })}
              placeholder={"0010001W"}
            />
          </FormControl>
          <Button
            isDisabled={!active}
            type="submit"
            isLoading={isLoading}
            variant="primary"
          >
            Valider l'établissement
          </Button>
        </Flex>
      </Box>
    </DarkMode>
  );
};
