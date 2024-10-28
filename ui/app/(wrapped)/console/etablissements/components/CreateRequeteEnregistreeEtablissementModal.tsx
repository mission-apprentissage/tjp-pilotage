import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { client } from "@/api.client";

import { Filters } from "../types";

const COULEURS_DISPONIBLES = [
  {
    value: "redmarianne.625_hover",
    label: "Rouge",
  },
  {
    value: "purpleGlycine.494",
    label: "Violet",
  },
  {
    value: "blueecume.850",
    label: "Bleu",
  },
  {
    value: "pinkmacaron.850",
    label: "Rose",
  },
  {
    value: "green.submitted",
    label: "Vert",
  },
  {
    value: "yellowTournesol.950",
    label: "Jaune",
  },
];

// enum FILTRES_KEYS {
//   "codeRegion" = "regions",
//   "codeAcademie" = "academies",
//   "codeDepartement" = "departements",
//   "codeCommune" = "communes",
//   "codeNiveauDiplome" = "diplomes",
//   "codeDispositif" = "dispositifs",
//   "codeNsf" = "libellesNsf",
//   "cfd" = "formations",
//   "cfdFamille" = "familles",
//   "positionQuadrant" = "positionsQuadrant",
// }

export const CreateRequeteEnregistreeModal = ({
  isOpen,
  onClose,
  searchParams, // filtersList,
}: {
  isOpen: boolean;
  onClose: () => void;
  searchParams?: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
  };
  // filtersList?: FiltersList;
}) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<
    (typeof client.inferArgs)["[POST]/requete/enregistrement"]["body"]
  >({
    shouldUseNativeValidation: false,
  });

  useEffect(
    () => reset(undefined, { keepDefaultValues: true }),
    [isOpen, reset]
  );

  const queryClient = useQueryClient();

  const [serverErrors, setServerErrors] = useState<Record<string, string>>();

  const {
    mutate: createRequeteEnregistree,
    isLoading,
    isError,
  } = client.ref("[POST]/requete/enregistrement").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/requetes"]);
      onClose();
    },
    //@ts-ignore
    onError: (e: AxiosError<{ errors: Record<string, string> }>) => {
      const errors = e.response?.data.errors;
      setServerErrors(errors);
    },
  });

  // const getFilterValue = (key: string, value: string | Array<string>) => {
  //   if (typeof value === "string") {
  //     return filtersList?.[
  //       FILTRES_KEYS[key as keyof typeof FILTRES_KEYS] as keyof FiltersList
  //     ]?.find((filter) => filter.value === value)?.label;
  //   }
  //   return value
  //     .map(
  //       (v) =>
  //         filtersList?.[
  //           FILTRES_KEYS[key as keyof typeof FILTRES_KEYS] as keyof FiltersList
  //         ]?.find((filter) => filter.value === v)?.label
  //     )
  //     .join(", ");
  // };

  const couleur = watch("couleur");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit((form) =>
          createRequeteEnregistree({
            body: {
              ...form,
              page: "formationEtablissement",
              filtres: {
                ...searchParams?.filters,
                search: searchParams?.search,
                withAnneeCommune: searchParams?.withAnneeCommune,
              },
            },
          })
        )}
      >
        <ModalHeader>Enregistrer les filtres actuels en favori</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.nom} isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              {...register("nom")}
              width={"64"}
              placeholder="Nom de la requête"
            />
            {!!errors.nom && (
              <FormErrorMessage>{errors.nom.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.couleur} isRequired>
            <FormLabel>Couleur</FormLabel>
            <Menu gutter={0} matchWidth={true} autoSelect={false}>
              <MenuButton
                as={Button}
                variant={"selectButton"}
                rightIcon={<ChevronDownIcon />}
                width={"64"}
                size="md"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="grey.900"
                bg={"white"}
              >
                {couleur ? (
                  <Flex direction="row" gap={2}>
                    <Tag
                      size={"sm"}
                      colorScheme={couleur}
                      bgColor={couleur}
                      borderRadius={"100%"}
                    />
                    <Text my={"auto"}>
                      {
                        COULEURS_DISPONIBLES.find((c) => c.value === couleur)
                          ?.label
                      }
                    </Text>
                  </Flex>
                ) : (
                  <Flex direction="row">
                    <Text my={"auto"}>Couleur</Text>
                  </Flex>
                )}
              </MenuButton>
              <MenuList py={0} borderTopRadius={0}>
                {COULEURS_DISPONIBLES.map((couleur) => (
                  <MenuItem
                    p={2}
                    key={couleur.value}
                    onClick={() => setValue("couleur", couleur.value)}
                    gap={2}
                  >
                    <Tag
                      size={"sm"}
                      colorScheme={couleur.value}
                      bgColor={couleur.value}
                      borderRadius={"100%"}
                    />
                    <Flex direction="row">{couleur.label}</Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            {!!errors.couleur && (
              <FormErrorMessage>{errors.couleur.message}</FormErrorMessage>
            )}
          </FormControl>
          {/* {searchParams?.filters && (
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Td>Nom</Td>
                        <Td>Valeur</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.entries(searchParams?.filters)
                        .filter(([_key, value]) => value)
                        .map(([key, value]) => (
                          <Tr key={key}>
                            <Td>{FILTRES_KEYS[key]}</Td>
                            <Td>{getFilterValue(key, value)}</Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
            )} */}
          {isError && (
            <Alert status="error">
              {serverErrors ? (
                <UnorderedList>
                  {Object.entries(serverErrors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </UnorderedList>
              ) : (
                <AlertDescription>Erreur lors de la création</AlertDescription>
              )}
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="primary" ml={3} isLoading={isLoading} type="submit">
            Envoyer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
