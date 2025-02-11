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
import { getHierarchy, hasRole } from "shared";
import {RoleEnum} from 'shared/enum/roleEnum';
import { UserFonctionEnum } from "shared/enum/userFonctionEnum";
import { z } from "zod";

import { client } from "@/api.client";
import { getErrorMessage } from "@/utils/apiError";
import { useAuth } from "@/utils/security/useAuth";

export const CreateUser = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, role } = useAuth();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<(typeof client.inferArgs)["[POST]/users/:userId"]["body"]>({
    shouldUseNativeValidation: false,
    defaultValues: {
      email: "",
      codeRegion: "",
      firstname: "",
      lastname: "",
      role: RoleEnum["gestionnaire_region"],
    },
  });

  useEffect(() => reset(undefined, { keepDefaultValues: true }), [isOpen, reset]);

  const { data: regions } = client.ref("[GET]/regions").useQuery({});

  const queryClient = useQueryClient();

  const {
    mutate: createUser,
    isLoading,
    isError,
    error,
  } = client.ref("[POST]/users/:userId").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/users"]);
      onClose();
    },
  });

  const onSubmit = (v: (typeof client.inferArgs)["[POST]/users/:userId"]["body"]) =>
    createUser({ body: { ...v, codeRegion: v.codeRegion || undefined } });

  const roles = getHierarchy(role);
  const isAdminRegion = hasRole({user, role: RoleEnum["admin_region"]});
  const filteredRegions = (() => {
    if (!regions) return [];
    if (isAdminRegion) {
      return regions.filter((region) => region.value === user?.codeRegion);
    }
    return regions;
  })();

  useEffect(() => {
    if (isAdminRegion && filteredRegions && filteredRegions.length > 0) {
      setValue("codeRegion", filteredRegions[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRegions]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalHeader>Ajouter un utilisateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email", {
                validate: (v) => z.string().email().safeParse(v).success || "Veuillez saisir un email valide",
              })}
            />
            {!!errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.firstname} isRequired>
            <FormLabel>Prénom</FormLabel>
            <Input
              {...register("firstname", {
                required: "Veuillez saisir un prénom",
              })}
            />
            {!!errors.firstname && <FormErrorMessage>{errors.firstname.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.lastname} isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              {...register("lastname", {
                required: "Veuillez saisir un nom",
              })}
            />
            {!!errors.lastname && <FormErrorMessage>{errors.lastname.message}</FormErrorMessage>}
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
            {!!errors.role && <FormErrorMessage>{errors.role.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.codeRegion} isRequired={isAdminRegion}>
            <FormLabel>Code région</FormLabel>
            <Select
              {...register("codeRegion", {
                required: {
                  value: isAdminRegion,
                  message: "Veuillez choisir une région",
                },
              })}
            >
              {!isAdminRegion && <option value="">Aucune</option>}
              {filteredRegions?.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </Select>
            {!!errors.codeRegion && <FormErrorMessage>{errors.codeRegion.message}</FormErrorMessage>}
          </FormControl>
          {isError && (
            <Alert status="error">
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}

          <FormControl mb="4" isInvalid={!!errors.fonction}>
            <FormLabel>Fonction de l'utilisateur</FormLabel>
            <Select {...register("fonction")}>
              {<option value="">Aucune</option>}
              {Object.keys(UserFonctionEnum)?.map((userFonction) => (
                <option key={userFonction} value={userFonction}>
                  {userFonction}
                </option>
              ))}
            </Select>
            {!!errors.fonction && <FormErrorMessage>{errors.fonction.message}</FormErrorMessage>}
          </FormControl>
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
