"use client";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Collapse,
  DarkMode,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../api.client";

const UaiRegex = /^[A-Z0-9]{8}$/;
const cfdRegex = /^[A-Z0-9]{8}$/;

const forms = {
  1: { uai: "0010001W" },
  2: {
    cfd: "",
    type: "",
    libelleDiplome: "",
    codeDispositif: "",
    motif: [],
    autreMotif: "",
    observation: "",
    coloration: undefined,
    poursuitePedagogique: undefined,
    amiCma: undefined,
  },
};

export const IntentionForm = () => {
  const [step, setStep] = useState(1);

  const [intention, setIntention] = useState(forms);

  return (
    <Box flex={1} bg="#E2E7F8">
      <Box maxW="900px" mx="auto" width="100%" mt="10" mb="20">
        <UaiBlock
          onOpen={() => setStep(1)}
          active={step === 1}
          defaultValues={intention[1]}
          onSubmit={(values) => {
            setIntention({ ...intention, 1: values });
            setStep(2);
          }}
        />
        <Collapse in={step === 2} animateOpacity>
          <InformationsBlock
            onSubmit={(values) => {
              const newIntention = { ...intention, 2: values };
              setIntention(newIntention);
              console.log(newIntention);
            }}
            defaultValues={intention[2]}
          />
        </Collapse>
      </Box>
    </Box>
  );
};

const InformationsBlock = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: typeof forms["2"];
  onSubmit: (values: typeof forms[2]) => void;
}) => {
  const form = useForm({
    defaultValues,
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = form;

  const motif = watch("motif");
  console.log(motif, errors);

  return (
    <FormProvider {...form}>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        as="form"
        p="6"
        mt="6"
        borderRadius={6}
      >
        <CfdInput />
        <Heading as="h2" fontSize="xl">
          Type de demande
        </Heading>
        <Divider pt="4" mb="4" />
        <FormControl mb="4" maxW="500px" isInvalid={!!errors.type}>
          <FormLabel>Ma demande concerne</FormLabel>
          <Select
            bg="white"
            {...register("type", {
              required: "Le type de demande est obligatoire",
            })}
            placeholder="Séléctionner une option"
          >
            <option value="ouverture">Ouverture</option>
            <option value="fermeture">Fermeture</option>
            <option value="augmentation">Augmentation</option>
            <option value="diminution">Diminution</option>
          </Select>
          {errors.type && (
            <FormErrorMessage>{errors.type.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb="4" isInvalid={!!errors.motif}>
          <FormLabel>Merci de préciser le(s) motif(s)</FormLabel>
          <Controller
            name="motif"
            control={control}
            rules={{ required: "Le motif est obligatoire" }}
            render={({ field: { onChange, value } }) => (
              <CheckboxGroup
                onChange={(val) => {
                  onChange(val);
                }}
                defaultValue={value}
              >
                <Stack spacing={[3]}>
                  <Checkbox value="1">Taux d’emploi favorable</Checkbox>
                  <Checkbox value="2">Taux de poursuite favorable</Checkbox>
                  <Checkbox value="3">
                    Besoins recrutements avérés localement
                  </Checkbox>
                  <Checkbox value="4">
                    Métiers 2030 Texte de description additionnel
                  </Checkbox>
                  <Checkbox value="5">Parcours pédagogique</Checkbox>
                  <Checkbox value="6">Maintien pour public spécifique</Checkbox>
                  <Checkbox value="7">Nouvel établissement</Checkbox>
                  <Checkbox value="8">
                    Établissement privé sous contrat
                  </Checkbox>
                  <Checkbox value="9">
                    Fermeture / diminution en compensation
                  </Checkbox>
                  <Checkbox value="10">
                    Autre motif (veuillez préciser)
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
            )}
          />
          {errors.motif && (
            <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>
          )}
        </FormControl>

        <Collapse in={(motif as any).includes("10")} unmountOnExit>
          <FormControl mb="4" maxW="500px" isInvalid={!!errors.autreMotif}>
            <FormLabel>Autre motif</FormLabel>
            {(motif as any).includes("10") && (
              <Textarea
                {...register("autreMotif", {
                  shouldUnregister: true,
                  required: "Veuillez préciser votre motif",
                })}
              />
            )}
            {errors.autreMotif && (
              <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>
            )}
          </FormControl>
        </Collapse>

        <FormControl mb="4" maxW="500px" isInvalid={!!errors.observation}>
          <FormLabel>Observation</FormLabel>
          <Textarea {...register("observation", {})} />
          {errors.observation && (
            <FormErrorMessage>{errors.observation.message}</FormErrorMessage>
          )}
        </FormControl>
        <Heading as="h2" fontSize="xl" mt="8">
          Diplôme concerné
        </Heading>
        <Divider pt="4" mb="4" />

        <FormControl mb="4" maxW="500px" isInvalid={!!errors.libelleDiplome}>
          <FormLabel>Intitulé du diplôme correspondant</FormLabel>
          <Input
            {...register("libelleDiplome", {
              required: "Le code diplôme est obligatoire",
              disabled: true,
            })}
          />
          {errors.cfd && (
            <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb="4" maxW="500px" isInvalid={!!errors.codeDispositif}>
          <FormLabel>Dispositif</FormLabel>
          <Select
            placeholder="Séléctionner une option"
            {...register("codeDispositif", {
              required: "Le dispositif est obligatoire",
            })}
          >
            <option value="222">CAP en 1 an</option>
            <option value="333">CAP en 2 ans</option>
          </Select>
          {errors.codeDispositif && (
            <FormErrorMessage>{errors.codeDispositif.message}</FormErrorMessage>
          )}
        </FormControl>
        <Heading as="h2" fontSize="xl" mt="8">
          Renseignements complémentaires
        </Heading>
        <Divider pt="4" mb="4" />
        <FormControl mb="4" isInvalid={!!errors.coloration}>
          <FormLabel>Coloration</FormLabel>
          <Controller
            name="coloration"
            control={control}
            rules={{ required: "Ce champ est obligatoire" }}
            render={({ field: { onChange, value, ref, name, onBlur } }) => (
              <RadioGroup
                as={Stack}
                onChange={onChange}
                value={value}
                ref={ref}
                name={name}
                onBlur={onBlur}
              >
                <Radio value="true">Oui</Radio>
                <Radio value="false">Non</Radio>
              </RadioGroup>
            )}
          />
          {errors.coloration && (
            <FormErrorMessage>{errors.coloration?.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb="4" isInvalid={!!errors.amiCma}>
          <FormLabel>AMI / CMA</FormLabel>
          <Controller
            name="amiCma"
            control={control}
            rules={{ required: "Ce champ est obligatoire" }}
            render={({ field: { onChange, value } }) => (
              <RadioGroup as={Stack} onChange={onChange} value={value}>
                <Radio value="true">Oui</Radio>
                <Radio value="false">Non</Radio>
              </RadioGroup>
            )}
          />
          {errors.amiCma && (
            <FormErrorMessage>{errors.amiCma?.message}</FormErrorMessage>
          )}
        </FormControl>
        <Flex mt="10" mb="4">
          <Button variant="primary" type="submit">
            Envoyer
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
};

const CfdInput = () => {
  const {
    formState: { errors, isSubmitting },
    register,
    watch,
    trigger,
    getValues,
  } = useFormContext<typeof forms[2]>();

  const cfd = watch("cfd");
  const isValidCfd = cfdRegex.test(cfd);

  const [status, setStatus] = useState<ApiType<typeof api.checkCfd>>();
  useEffect(() => {
    if (!status) return;
    trigger("cfd");
  }, [status]);

  const fetchStatus = async () => {
    const res = await api
      .checkCfd({ params: { cfd: getValues("cfd") } })
      .call();
    setStatus(res);
  };

  return (
    <>
      <FormControl mb="4" maxW="500px" isInvalid={!!errors.cfd?.message}>
        <FormLabel>Saisie du code diplôme</FormLabel>
        <Flex>
          <InputGroup>
            <Input
              {...register("cfd", {
                required: "Le code diplôme est obligatoire",
                pattern: {
                  value: cfdRegex,
                  message: "Le code diplôme n'est pas au bon format",
                },
                onChange: () => {
                  if (status) setStatus(undefined);
                  if (errors.cfd) trigger("cfd");
                },
                validate: {
                  as: async () => {
                    if (!status)
                      return isSubmitting
                        ? "Veuillez valider le code diplôme"
                        : true;

                    if (status.status !== "valid")
                      return "Le code diplôme est introuvable";

                    return true;
                  },
                },
              })}
            />
            {status?.status === "valid" && (
              <InputRightElement bg="transparent">
                {<CheckIcon color="green" />}
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            isDisabled={!isValidCfd || !!status}
            onClick={fetchStatus}
            ml="2"
            variant="primary"
          >
            Valider
          </Button>
        </Flex>

        {errors.cfd?.message && (
          <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
        )}
        {isValidCfd && !status && !errors.cfd && (
          <Text color="orange.400" mt="2" fontSize="sm">
            Veuillez valider le code diplôme
          </Text>
        )}
      </FormControl>
      <FormControl mb="4" maxW="500px">
        <Input
          disabled
          value={(status?.status === "valid" && status.data.libelle) || ""}
        />
      </FormControl>
    </>
  );
};

const UaiBlock = ({
  active,
  onSubmit,
  onOpen,
  defaultValues,
}: {
  active: boolean;
  onSubmit: (values: typeof forms[1]) => void;
  onOpen: () => void;
  defaultValues: typeof forms[1];
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
                  Format incorrecte
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
                  const validation = await checkUai(uai);
                  if (validation.status === "valid") {
                    return true;
                  } else {
                    return "Le code UAI est introuvable";
                  }
                },
              })}
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
