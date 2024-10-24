import {
  Alert,
  AlertDescription,
  Button,
  Checkbox,
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
import { getHierarchy, Role } from "shared";
import { z } from "zod";

import { client } from "../../../../api.client";
import { useAuth } from "../../../../utils/security/useAuth";

export const EditUser = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: (typeof client.infer)["[GET]/users"]["users"][number];
}) => {
  const { auth } = useAuth();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<(typeof client.inferArgs)["[PUT]/users/:userId"]["body"]>({
    shouldUseNativeValidation: false,
    defaultValues: {
      email: "",
      codeRegion: "",
      firstname: "",
      lastname: "",
      role: "gestionnaire_region",
      enabled: true,
    },
  });

  useEffect(() => {
    reset(user, { keepDefaultValues: true });
  }, [isOpen, reset]);

  const { data: regions } = client.ref("[GET]/regions").useQuery({});

  const queryClient = useQueryClient();

  const {
    mutate: updateUser,
    isLoading,
    isError,
  } = client.ref("[PUT]/users/:userId").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/users"]);
      onClose();
    },
  });

  const roles = getHierarchy(auth?.user?.role as Role);
  const isAdminRegion = auth?.user?.role === "admin_region";
  const filteredRegions = (() => {
    if (!regions) return [];
    if (isAdminRegion) {
      return regions.filter(
        (region) => region.value === auth?.user?.codeRegion
      );
    }
    return regions;
  })();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit((v) =>
          updateUser({
            body: { ...v, codeRegion: v.codeRegion || null },
            params: { userId: user?.id },
          })
        )}
      >
        <ModalHeader>Éditer un utilisateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
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
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
            {!!errors.role && (
              <FormErrorMessage>{errors.role.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.codeRegion}>
            <FormLabel>Code région</FormLabel>
            <Select {...register("codeRegion")}>
              {!isAdminRegion && <option value="">Aucune</option>}
              {filteredRegions?.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </Select>
            {!!errors.codeRegion && (
              <FormErrorMessage>{errors.codeRegion.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.enabled}>
            <Checkbox {...register("enabled")} isRequired={false}>
              Compte actif
            </Checkbox>
            {!!errors.enabled && (
              <FormErrorMessage>{errors.enabled.message}</FormErrorMessage>
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
