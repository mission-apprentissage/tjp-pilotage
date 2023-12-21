import {
  Alert,
  AlertDescription,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PERMISSIONS } from "shared";
import { z } from "zod";

import { client } from "../../../../api.client";

export const CreateUser = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<(typeof client.inferArgs)["[POST]/users/:userId"]["body"]>({
    defaultValues: {
      email: "",
      codeRegion: "",
      firstname: "",
      lastname: "",
      role: "gestionnaire_region",
    },
  });

  useEffect(
    () => reset(undefined, { keepDefaultValues: true }),
    [isOpen, reset]
  );

  const { data: regions } = client.ref("[GET]/regions").useQuery({});

  const queryClient = useQueryClient();

  const {
    mutate: createUser,
    isLoading,
    isError,
  } = client.ref("[POST]/users/:userId").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/users"]);
      onClose();
    },
  });

  const onSubmit = (
    v: (typeof client.inferArgs)["[POST]/users/:userId"]["body"]
  ) => createUser({ body: { ...v, codeRegion: v.codeRegion || undefined } });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Ajouter un utilisateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email", {
                validate: (v) =>
                  z.string().email().safeParse(v).success ||
                  "Veuillez saisir un email valide",
              })}
            />
            {!!errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.firstname} isRequired>
            <FormLabel>Prénom</FormLabel>
            <Input
              {...register("firstname", {
                required: "Veuillez saisir un prénom",
              })}
            />
            {!!errors.firstname && (
              <FormErrorMessage>{errors.firstname.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.lastname} isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              {...register("lastname", {
                required: "Veuillez saisir un nom",
              })}
            />
            {!!errors.lastname && (
              <FormErrorMessage>{errors.lastname.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.role} isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              {...register("role", {
                required: "Veuillez choisir un role",
              })}
            >
              {Object.keys(PERMISSIONS).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
            {!!errors.role && (
              <FormErrorMessage>{errors.role.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.codeRegion} isRequired>
            <FormLabel>Code région</FormLabel>
            <Select {...register("codeRegion")}>
              <option value="">Aucune</option>
              {regions?.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </Select>
            {!!errors.codeRegion && (
              <FormErrorMessage>{errors.codeRegion.message}</FormErrorMessage>
            )}
          </FormControl>
          {isError && (
            <Alert status="error">
              <AlertDescription>Erreur lors de la création</AlertDescription>
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
