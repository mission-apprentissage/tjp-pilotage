import { ChevronDownIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  Button,
  createIcon,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListItem,
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
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { client } from "@/api.client";
import {getErrorMessage} from '@/utils/apiError';
import { useAuth } from "@/utils/security/useAuth";

import { FilterTags } from "./FilterTags";
import type { Filters, FiltersList, TypePage } from "./types";

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

export const CreateRequeteEnregistreeModal = ({
  page,
  isOpen,
  onClose,
  searchParams,
  filtersList,
  altText,
}: {
  page: TypePage;
  isOpen: boolean;
  onClose: () => void;
  searchParams?: {
    filters?: Partial<Filters>;
    search?: string;
  };
  filtersList?: FiltersList;
  altText?: ReactNode;
}) => {
  const toast = useToast();
  const { auth } = useAuth();
  const {
    watch,
    setValue,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<(typeof client.inferArgs)["[POST]/requete/enregistrement"]["body"]>({
    defaultValues: {
      couleur: "blueecume.850",
    },
    shouldUseNativeValidation: false,
  });

  useEffect(() => reset(undefined, { keepDefaultValues: true }), [isOpen, reset]);

  const queryClient = useQueryClient();


  const {
    mutate: createRequeteEnregistree,
    isLoading,
    isError,
    error
  } = client.ref("[POST]/requete/enregistrement").useMutation({
    onSuccess: () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La requête favorite a bien été enregistrée",
      });
      queryClient.invalidateQueries(["[GET]/requetes"]);
      onClose();
    },
  });

  const couleur = watch("couleur");

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      variant: "left-accent",
      status: "success",
      title: "URL copiée dans le presse-papier",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      {auth ? (
        <ModalContent
          as="form"
          onSubmit={handleSubmit((form) => {
            form.nom ??=  `Recherche du ${format(new Date(), "dd/MM/yyyy")}`;
            return createRequeteEnregistree({
              body: {
                ...form,
                page,
                filtres: {
                  ...searchParams?.filters,
                  search: searchParams?.search,
                },
              },
            });
          })}
        >
          <ModalHeader>{altText ?? "Enregistrer la requête"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4" isInvalid={!!errors.nom}>
              <FormLabel>Nom de la requête</FormLabel>
              <Input {...register("nom")} width={350} placeholder="Saisir un nom court et facilement identifiable" />
              {!!errors.nom && <FormErrorMessage>{errors.nom.message as string}</FormErrorMessage>}
            </FormControl>
            <FormControl mb="4" isInvalid={!!errors.couleur} isRequired>
              <FormLabel>Badge</FormLabel>
              <Menu gutter={0} matchWidth={true} autoSelect={false}>
                <MenuButton
                  as={Button}
                  variant={"selectButton"}
                  rightIcon={<ChevronDownIcon />}
                  width={350}
                  size="md"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="grey.900"
                  bg={"white"}
                >
                  <Flex direction="row" gap={2}>
                    <Tag size={"sm"} colorScheme={couleur} bgColor={couleur} borderRadius={"100%"} />
                    <Text my={"auto"}>{COULEURS_DISPONIBLES.find((c) => c.value === couleur)?.label}</Text>
                  </Flex>
                </MenuButton>
                <MenuList py={0} borderTopRadius={0}>
                  {COULEURS_DISPONIBLES.map((couleur) => (
                    <MenuItem p={2} key={couleur.value} onClick={() => setValue("couleur", couleur.value)} gap={2}>
                      <Tag size={"sm"} colorScheme={couleur.value} bgColor={couleur.value} borderRadius={"100%"} />
                      <Flex direction="row">{couleur.label}</Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {!!errors.couleur && <FormErrorMessage>{errors.couleur.message as string}</FormErrorMessage>}
            </FormControl>
            <Flex direction={"column"} gap={3}>
              <Text fontWeight={700}>Filtres actifs :</Text>
              <FilterTags filters={searchParams?.filters} filtersList={filtersList} />
            </Flex>
            {isError && (
              <Alert status="error">
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" ml={3} isLoading={isLoading} type="submit">
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : (
        <ModalContent>
          <ModalHeader>Enregistrer les filtres actuels en favori</ModalHeader>
          <ModalCloseButton />
          <ModalBody gap={3}>
            <Text mb={2}>Cette fonctionnalité est réservée aux utilisateurs connectés afin de :</Text>
            <UnorderedList spacing={3} mb={2}>
              <ListItem ms={2}>
                <strong>Sauvegarder une requête</strong> (filtres saisies et résultats) pour la retrouver facilement
              </ListItem>
              <ListItem ms={2}>
                <strong>Exporter les données</strong> spécifiques à une requête et non toutes les données
              </ListItem>
            </UnorderedList>
            <Text>
              Connectez-vous pour accéder à la fonctionnalité, sinon vous pouvez copier-coller l'URL d'accès direct à
              votre recherche.
            </Text>
          </ModalBody>
          <ModalFooter mt={1}>
            <Flex w={"100%"} justifyContent={"space-between"}>
              <Button fontWeight="light" as={NextLink} color="bluefrance.113" href="/auth/login" variant="ghost">
                <LoginIcon mr="2" />
                Se connecter
              </Button>
              <Button variant="primary" onClick={copyUrlToClipboard}>
                <LinkIcon mr="2" />
                Copier l'URL
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

const LoginIcon = createIcon({
  displayName: "loginIcon",
  viewBox: "0 0 24 24",
  defaultProps: {
    stroke: "currentcolor",
    fill: "none",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  path: (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" x2="3" y1="12" y2="12"></line>
    </>
  ),
});
