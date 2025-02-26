import {ChevronDownIcon} from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useQueryClient } from "@tanstack/react-query";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { toDate } from "date-fns";
import {useContext,useEffect} from 'react';
import {Controller,useForm} from 'react-hook-form';
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import {client} from '@/api.client';
import {PreviousCampagneContext} from '@/app/previousCampagneContext';
import {CampagneStatutTag} from '@/components/CampagneStatutTag';
import {getErrorMessage} from '@/utils/apiError';
import { getDatePickerConfig } from "@/utils/getDatePickerConfig";
import {useAuth} from '@/utils/security/useAuth';
import { useCurrentCampagne } from '@/utils/security/useCurrentCampagne';
import {toBoolean} from '@/utils/toBoolean';

export const EditCampagneRegion = ({
  isOpen,
  onClose,
  campagneRegion,
  campagnes,
  regions
}: {
  isOpen: boolean;
  onClose: () => void;
  campagneRegion: (typeof client.infer)["[GET]/campagnes-region"][number];
  campagnes: (typeof client.infer)["[GET]/campagnes"],
  regions?: (typeof client.infer)["[GET]/regions"]
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const {
    getValues,
    setValue,
    register,
    formState: { errors },
    reset,
    handleSubmit,
    control,
    watch
  } = useForm<(typeof client.inferArgs)["[PUT]/campagnes-region/:campagneRegionId"]["body"]>({
    shouldUseNativeValidation: false,
    defaultValues: {
      codeRegion: campagneRegion.codeRegion,
      statut: campagneRegion.statut,
      dateFin: campagneRegion.dateFin,
      dateDebut: campagneRegion.dateDebut,
    },
  });

  useEffect(() => {
    reset(campagneRegion, { keepDefaultValues: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset]);

  const queryClient = useQueryClient();

  const { campagne: currentCampagneNationale, setCampagne: setCurrentCampagne } = useCurrentCampagne();
  const { setCampagne: setPreviousCampagne } = useContext(PreviousCampagneContext);

  const {
    mutate: editCampagneRegion,
    isLoading,
    isError,
    error,
  } = client.ref("[PUT]/campagnes-region/:campagneRegionId").useMutation({
    onSuccess: async () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La campagne régionale a été modifiée avec succès",
      });
      queryClient.invalidateQueries(["[GET]/campagnes-region"]);
      await client.ref("[GET]/campagne/current").query({}).then((campagne) => {
        setCurrentCampagne(campagne.current);
        setPreviousCampagne(campagne.previous);
      });
      onClose();
    },
  });

  const campagneId = watch("campagneId");
  const parentCampagne = campagnes.find(({ id }) => id === campagneId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit((form) =>
          editCampagneRegion({
            body: {
              ...form,
              dateDebut: toDate(form.dateDebut).toISOString(),
              dateFin: toDate(form.dateFin).toISOString(),
            },
          })
        )}
      >
        <ModalHeader>Éditer une campagne régionale</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" isInvalid={!!errors.campagneId} isRequired>
            <Text mb={2} fontWeight={700}>
              <Highlight query={"*"} styles={{ color: "red" }}>
                Campagne nationale
              </Highlight>
            </Text>
            <Button
              variant={"selectButton"}
              rightIcon={<ChevronDownIcon />}
              width={[null, null, "72"]}
              size="md"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="grey.900"
              bg={"white"}
              isDisabled={true}
            >
              <Flex direction="row" w="100%">
                <Flex direction={"row"} gap={2}>
                  <Text>{parentCampagne?.annee}</Text>
                  <CampagneStatutTag statut={parentCampagne?.statut} mb={"auto"} />
                </Flex>
              </Flex>
            </Button>
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.statut} isRequired>
            <FormLabel>Statut</FormLabel>
            <Select
              width={[null, null, "72"]}
              {...register("statut", {
                required: "Veuillez saisir un statut",
              })}
            >
              {Object.keys(CampagneStatutEnum).map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </Select>
            {!!errors.statut && <FormErrorMessage>{errors.statut.message}</FormErrorMessage>}
          </FormControl>
          {!user?.codeRegion &&
          (
            <FormControl mb="4" isInvalid={!!errors.codeRegion} isRequired>
              <FormLabel>Région</FormLabel>
              <Select
                width={[null, null, "72"]}
                {...register("codeRegion", {
                  required: "Veuillez sélectionner une région",
                })}
              >
                {regions?.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
              {!!errors.codeRegion && <FormErrorMessage>{errors.codeRegion.message}</FormErrorMessage>}
            </FormControl>
          )}
          <FormControl mb="4" isInvalid={!!errors.dateDebut} isRequired>
            <FormLabel>Date début</FormLabel>
            <SingleDatepicker
              date={getValues("dateDebut") ? toDate(getValues("dateDebut")) : undefined}
              onDateChange={(date) => {
                setValue("dateDebut", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              minDate={
                currentCampagneNationale?.dateDebut ?
                  toDate(currentCampagneNationale.dateDebut) :
                  undefined
              }
              maxDate={
                getValues("dateFin") ? toDate(getValues("dateFin")) :
                  currentCampagneNationale?.dateFin ?
                    toDate(currentCampagneNationale.dateFin) :
                    undefined
              }
              configs={getDatePickerConfig()}
              propsConfigs={{
                inputProps: {
                  id: "input-date-debut",
                },
                triggerBtnProps: {
                  width: [null, null, "72"],
                  fontSize: 14,
                  fontWeight: 400,
                  justifyContent: "start"
                },
              }}
            />
            {!!errors.dateDebut && <FormErrorMessage>{errors.dateDebut.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4" isInvalid={!!errors.dateFin} isRequired>
            <FormLabel>Date de fin</FormLabel>
            <SingleDatepicker
              date={getValues("dateFin") ? toDate(getValues("dateFin")) : undefined}
              onDateChange={(date) => {
                setValue("dateFin", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              minDate={
                getValues("dateDebut") ? toDate(getValues("dateDebut")) :
                  currentCampagneNationale?.dateDebut ?
                    toDate(currentCampagneNationale.dateDebut) :
                    undefined
              }
              maxDate={
                currentCampagneNationale?.dateFin ?
                  toDate(currentCampagneNationale.dateFin) :
                  undefined
              }
              configs={getDatePickerConfig()}
              propsConfigs={{
                inputProps: {
                  id: "input-date-fin",
                },
                triggerBtnProps: {
                  width: [null, null, "72"],
                  fontSize: 14,
                  fontWeight: 400,
                  justifyContent: "start"
                },
              }}
            />
            {!!errors.dateFin && <FormErrorMessage>{errors.dateFin.message}</FormErrorMessage>}
          </FormControl>
          <FormControl mb="4">
            <FormLabel htmlFor="input-date-vote">Date du vote CR</FormLabel>
            <SingleDatepicker
              date={getValues("dateVote") ? toDate(getValues("dateVote")!) : undefined}
              onDateChange={(date) => {
                setValue("dateVote", date.toISOString(), {
                  shouldValidate: true,
                });
              }}
              minDate={
                getValues("dateDebut") ? toDate(getValues("dateDebut")!) :
                  currentCampagneNationale?.dateDebut ?
                    toDate(currentCampagneNationale.dateDebut) :
                    undefined
              }
              maxDate={
                getValues("dateFin") ? toDate(getValues("dateFin")!) :
                  currentCampagneNationale?.dateFin ?
                    toDate(currentCampagneNationale.dateFin) :
                    undefined
              }
              configs={getDatePickerConfig()}
              propsConfigs={{
                inputProps: {
                  id: "input-date-vote",
                },
                triggerBtnProps: {
                  width: [null, null, "72"],
                  fontSize: 14,
                  fontWeight: 400,
                  justifyContent: "start"
                },
              }}
            />
            {!!errors.dateVote && <FormErrorMessage>{errors.dateVote.message}</FormErrorMessage>}
          </FormControl>
          <FormControl as="fieldset" mb="4" isInvalid={!!errors.withSaisiePerdir} isRequired>
            <FormLabel as="legend" fontWeight={"bold"}>Saisie des demandes par les chefs d'établissement ?</FormLabel>
            <Controller
              name="withSaisiePerdir"
              control={control}
              rules={{
                validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
              }}
              render={({ field: { onChange, value, onBlur, ref } }) => (
                <RadioGroup
                  ms={6}
                  as={Stack}
                  direction={"row"}
                  gap={4}
                  onBlur={onBlur}
                  onChange={(v) => onChange(toBoolean(v))}
                  value={JSON.stringify(value)}
                >
                  <Radio ref={ref} value="true">
                    Oui
                  </Radio>
                  <Radio ref={ref} value="false">
                    Non
                  </Radio>
                </RadioGroup>
              )} />
            {!!errors.withSaisiePerdir && <FormErrorMessage>{errors.withSaisiePerdir.message}</FormErrorMessage>}
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
