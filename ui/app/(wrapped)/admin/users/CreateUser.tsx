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
import _ from "lodash";
import { useEffect } from "react";
import { Controller,useForm } from "react-hook-form";
import type { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { getHierarchy, hasRole } from "shared";
import type { Role} from 'shared/enum/roleEnum';
import { RoleEnum } from 'shared/enum/roleEnum';
import { UserFonctionEnum } from "shared/enum/userFonctionEnum";
import { z } from "zod";

import { client } from "@/api.client";
import type { Etablissements } from "@/app/(wrapped)/demandes/types";
import { getErrorMessage } from "@/utils/apiError";
import {formatRole} from '@/utils/formatLibelle';
import { useAuth } from "@/utils/security/useAuth";

export const CreateUser = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, role } = useAuth();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    control
  } = useForm<(typeof client.inferArgs)["[POST]/users/:userId"]["body"]>({
    shouldUseNativeValidation: false,
    defaultValues: {
      email: "",
      codeRegion: "",
      firstname: "",
      lastname: "",
      role: undefined,
      uais: undefined,
      fonction: null,
    },
  });
  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: errors.uais ? "red" : undefined,
    }),
  };

  useEffect(() => reset(undefined, { keepDefaultValues: true }), [isOpen, reset]);

  const { data: regions } = client.ref("[GET]/regions").useQuery({});
  const codeRegion = watch("codeRegion");
  const searchEtablissement = _.debounce((inputValue: string, callback: (options: Etablissements) => void) => {
    if (inputValue.length >= 3) {
      client
        .ref("[GET]/etablissement/search/:search")
        .query({ params: { search: inputValue }, query: { isFormulaire: false, codeRegion} })
        .then(options => callback(options));
    }
  }, 300);

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
    createUser({ body: {
      ...v,
      codeRegion: v.codeRegion ?? undefined,
      fonction: v.fonction ?? null,
      uais: v.uais ?? null
    }
  });

  const roles = getHierarchy(role);
  const isAdminRegion = hasRole({user, role: RoleEnum["admin_region"]});
  const filteredRegions = (() => {
    if (!regions) return [];
    if (isAdminRegion) {
      return regions.filter((region) => region.value === user?.codeRegion);
    }
    return regions;
  })();

  const newUserRole = watch("role") as Role;
  const shouldShowCodeRegionSelect =
    newUserRole === RoleEnum["gestionnaire_region"] ||
    newUserRole === RoleEnum["admin_region"] ||
    newUserRole === RoleEnum["expert_region"] ||
    newUserRole === RoleEnum["pilote_region"] ||
    newUserRole === RoleEnum["region"] ||
    newUserRole === RoleEnum["invite"] ||
    newUserRole === RoleEnum["perdir"];

  const shouldShowUaiSelect = newUserRole === RoleEnum["perdir"];

  useEffect(() => {
    if (isAdminRegion && filteredRegions && filteredRegions.length > 0) {
      setValue("codeRegion", filteredRegions[0].value);
    }
    if(!shouldShowUaiSelect) {
      setValue("uais", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRegions, newUserRole]);

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
                  {formatRole(role)}
                </option>
              ))}
            </Select>
            {!!errors.role && <FormErrorMessage>{errors.role.message}</FormErrorMessage>}
          </FormControl>
          {
            shouldShowCodeRegionSelect && (
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
            )
          }
          {
            shouldShowUaiSelect && (
              <FormControl mb="4" isInvalid={!!errors.uais} isRequired={true}>
                <FormLabel>Établissement(s)</FormLabel>
                <Controller
                  name="uais"
                  control={control}
                  rules={{ required: "Ce champ est obligatoire" }}
                  render={({ field: { onChange, name } }) => (
                    <AsyncSelect
                      instanceId={_.random(10000, 99999).toString()}
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
                      placeholder="UAI, nom de l'établissement ou commune"
                      isMulti={true}
                    />
                  )} />
                {!!errors.uais && <FormErrorMessage>{errors.uais.message}</FormErrorMessage>}
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
