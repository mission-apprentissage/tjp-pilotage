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
  Skeleton,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Role } from "shared";
import { getHierarchy, hasRole } from 'shared';
import { RoleEnum } from 'shared/enum/roleEnum';
import type { UserFonction} from "shared/enum/userFonctionEnum";
import { UserFonctionEnum } from "shared/enum/userFonctionEnum";
import { z } from "zod";

import { client } from "@/api.client";
import { getErrorMessage } from '@/utils/apiError';
import { useAuth } from "@/utils/security/useAuth";

type IUserForm = Omit<(typeof client.inferArgs)["[PUT]/users/:userId"]["body"], "fonction"> & { fonction: UserFonction | "" };

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
  } = useForm<IUserForm>({
    shouldUseNativeValidation: false,
    defaultValues: {
      email: user.email ?? "",
      codeRegion: user.codeRegion ?? "",
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      role: user.role ?? RoleEnum["gestionnaire_region"],
      enabled: user.enabled ?? true,
    },
  });

  useEffect(() => {
    reset(user, { keepDefaultValues: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset]);

  const { data: regions, isLoading: isLoadingRegions } = client.ref("[GET]/regions").useQuery({});

  const queryClient = useQueryClient();

  const {
    mutate: updateUser,
    isLoading,
    isError,
    error
  } = client.ref("[PUT]/users/:userId").useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["[GET]/users"]);
      onClose();
    },
  });

  const roles = getHierarchy(auth?.user?.role as Role);
  const isAdminRegion = hasRole({user: auth?.user, role: RoleEnum["admin_region"]});
  const filteredRegions = useMemo(() => {
    if (!regions) return [];
    if (isAdminRegion) {
      return regions.filter((region) => region.value === auth?.user?.codeRegion);
    }
    return regions;
  }, [regions, isAdminRegion, auth?.user?.codeRegion]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit((v) => {
          updateUser({
            body: {
              ...v,
              codeRegion: v.codeRegion === "" ? null : v.codeRegion,
              fonction: v.fonction === "" ? null : v.fonction,
            },
            params: { userId: user?.id },
          });
        })}
      >
        <ModalHeader>Éditer un utilisateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register("email", {
                validate: (v) => z.string().email().safeParse(v).success ?? "Veuillez saisir un email valide",
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
          {
            !isLoadingRegions ? (<FormControl mb="4" isInvalid={!!errors.codeRegion}>
              <FormLabel>Code région</FormLabel>
              <Select {...register("codeRegion")}>
                {!isAdminRegion && <option value={""}>Aucun</option>}
                {filteredRegions?.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
              {!!errors.codeRegion && <FormErrorMessage>{errors.codeRegion.message}</FormErrorMessage>}
            </FormControl>
            ) : <Skeleton mb="4" height="40px" />
          }
          <FormControl mb="4" isInvalid={!!errors.fonction}>
            <FormLabel>Fonction de l'utilisateur</FormLabel>
            <Select {...register("fonction")}>
              {<option value={""}>Aucune</option>}
              {Object.keys(UserFonctionEnum)?.map((userFonction) => (
                <option key={userFonction} value={userFonction}>
                  {userFonction}
                </option>
              ))}
            </Select>

            <FormControl my="4" isInvalid={!!errors.enabled}>
              <Checkbox {...register("enabled")} isRequired={false}>
                Compte actif
              </Checkbox>
              {!!errors.enabled && <FormErrorMessage>{errors.enabled.message}</FormErrorMessage>}
            </FormControl>
            {!!errors.fonction && <FormErrorMessage>{errors.fonction.message}</FormErrorMessage>}
          </FormControl>
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
    </Modal>
  );
};
