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
import { randomUUID } from "crypto";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller,useForm } from "react-hook-form";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import type { Role } from "shared";
import { getHierarchy, hasRole } from 'shared';
import { RoleEnum } from 'shared/enum/roleEnum';
import type { UserFonction} from "shared/enum/userFonctionEnum";
import { UserFonctionEnum } from "shared/enum/userFonctionEnum";
import { z } from "zod";

import { client } from "@/api.client";
import type { Etablissements } from "@/app/(wrapped)/demandes/types";
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
    watch,
    control
  } = useForm<IUserForm>({
    shouldUseNativeValidation: false,
    defaultValues: {
      email: user.email ?? "",
      codeRegion: user.codeRegion ?? "",
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      role: user.role ?? RoleEnum["gestionnaire_region"],
      enabled: user.enabled ?? true,
      uais: user.uais?.map((uai) => ({
        value: uai,
        label: undefined,
        commune: undefined
      })) ?? null
    },
  });
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: errors.uais ? "red" : undefined,
    }),
  };

  useEffect(() => {
    reset({
      ...user,
      uais: user.uais?.map((uai) => ({
        value: uai,
        label: undefined,
        commune: undefined
      })) ?? null
    }, { keepDefaultValues: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset]);

  const { data: regions, isLoading: isLoadingRegions } = client.ref("[GET]/regions").useQuery({});
  const [isLoadingEtablissements, setIsLoadingEtablissements] = useState(user.uais && user.uais.length > 0);
  const etablissements = user.uais && user.uais
    .map(
      (uai) => client.ref("[GET]/etablissement/:uai")
        .useQuery({ params: { uai } },
          { enabled: !!uai, onSuccess: () => setIsLoadingEtablissements(false) }))
        .map(res => res.data)
        .reduce((acc, curr) => {
          if (curr) {
            acc.push(curr);
          }
          return acc;
        }, [] as Etablissements
      );

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
  const codeRegion = watch("codeRegion");
  const searchEtablissement = _.debounce((inputValue: string, callback: (options: Etablissements) => void) => {
    if (inputValue.length >= 3) {
      client
        .ref("[GET]/etablissement/search/:search")
        .query({ params: { search: inputValue }, query: { isFormulaire: false, codeRegion: codeRegion ?? undefined} })
        .then(options => callback(options));
    }
  }, 300);

  const roles = getHierarchy(auth?.user?.role as Role);
  const isAdminRegion = hasRole({user: auth?.user, role: RoleEnum["admin_region"]});
  const filteredRegions = useMemo(() => {
    if (!regions) return [];
    if (isAdminRegion) {
      return regions.filter((region) => region.value === auth?.user?.codeRegion);
    }
    return regions;
  }, [regions, isAdminRegion, auth?.user?.codeRegion]);

  const newUserRole = watch("role") as Role;
  const shouldShowUaiSelect = newUserRole === RoleEnum["perdir"];

  console.log("etablissements", etablissements);

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
              uais: v.uais ?? null
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
          {
            shouldShowUaiSelect && !isLoadingEtablissements && (
              <FormControl mb="4" isInvalid={!!errors.uais} isRequired={true}>
                <FormLabel>Établissement(s)</FormLabel>
                <Controller
                  name="uais"
                  control={control}
                  rules={{ required: "Ce champ est obligatoire" }}
                  render={({ field: { onChange, name } }) => (
                    <AsyncSelect
                      instanceId={randomUUID()}
                      name={name}
                      styles={selectStyle}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      onChange={(selected) => {
                        onChange(selected ?? undefined);
                      }}
                      loadOptions={searchEtablissement}
                      loadingMessage={({ inputValue }) =>
                        inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
                      }
                      isClearable={true}
                      noOptionsMessage={({ inputValue }) =>
                        inputValue ? "Pas d'établissement correspondant à votre recherche" : "Commencez à écrire..."
                      }
                      defaultValue={
                        etablissements
                        // user.uais?.map((uai) => ({
                        //   value: uai,
                        //   label: uai,
                        //   commune: undefined
                        // })) ?? undefined

                        // [
                        //   {
                        //     value: "UAIAIAI",
                        //     label: "Établissement de test",
                        //     commune: "Commune de test"
                        //   },
                        //   {
                        //     value: "UAIAIA2",
                        //     label: "Établissement de test 2",
                        //     commune: "Commune de test 2"
                        //   }
                        // ]
                      }
                      placeholder="UAI, nom de l'établissement ou commune"
                      isMulti={true}
                    />
                  )} />
                {!!errors.codeRegion && <FormErrorMessage>{errors.codeRegion.message}</FormErrorMessage>}
              </FormControl>
            )
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
