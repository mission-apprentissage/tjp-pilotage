import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
  Select,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";

import { client } from "@/api.client";
import type { Intentions } from "@/app/(wrapped)/intentions/perdir/saisie/types";
import type { AnneeCampagneMotifCorrection} from "@/app/(wrapped)/intentions/utils/motifCorrectionUtils";
import { getMotifCorrectionOptionsParAnneeCampagne } from "@/app/(wrapped)/intentions/utils/motifCorrectionUtils";

export const CorrectionDemandeButton = chakra(
  ({ intention, campagne }: { intention: Intentions[number], campagne: CampagneType }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    const bluefrance113 = useToken("colors", "bluefrance.113");
    const [isCorrected, setIsCorrected] = useState<boolean>(!!intention.correction);

    const { mutateAsync: submitCorrection } = client.ref("[POST]/correction/submit").useMutation({
      onSuccess: (_body) => {
        queryClient.invalidateQueries(["[GET]/intentions/"]);
        let message: string | null = null;
        message = "Correction enregistrée avec succès";

        if (message) {
          toast({
            variant: "left-accent",
            title: message,
          });
        }
      },
    });

    const {
      isOpen: isOpenModalAnnulation,
      onOpen: onOpenModalAnnulation,
      onClose: onCloseModalAnnulation,
    } = useDisclosure();

    const { isOpen: isOpenModalReport, onOpen: onOpenModalReport, onClose: onCloseModalReport } = useDisclosure();

    const formReport = useForm<{
      motif: string;
      commentaire?: string;
    }>({
      mode: "onTouched",
      reValidateMode: "onChange",
    });

    const formAnnulation = useForm<{
      motif: string;
      commentaire?: string;
    }>({
      mode: "onTouched",
      reValidateMode: "onChange",
    });

    const [reportDemandeStep, setReportDemandeStep] = useState<1 | 2>(1);

    const [annulationDemandeStep, setAnnulationDemandeStep] = useState<1 | 2>(1);

    return (
      <>
        {
          isCorrected ? (
            <Tooltip label="demande déjà corrigée">
              <Button
                ms={2}
                disabled={isCorrected}
                rightIcon={<Icon icon="ri:arrow-down-s-line" color={bluefrance113} />}
                bgColor={"transparent"}
                border={"1px solid"}
                borderColor={bluefrance113}
                borderRadius="0"
                p={2}
                h={"fit-content"}
                opacity={0.3}
                cursor={"not-allowed"}
              >
                <Flex direction={"row"} gap={2}>
                  <Text color={bluefrance113}>Corriger la demande</Text>
                </Flex>
              </Button>
            </Tooltip>
          ) : (
            <Menu gutter={0} matchWidth={true}>
              <MenuButton
                ms={2}
                as={Button}
                rightIcon={<Icon icon="ri:arrow-down-s-line" color={bluefrance113} />}
                bgColor={"transparent"}
                border={"1px solid"}
                borderColor={bluefrance113}
                borderRadius="0"
                p={2}
                h={"fit-content"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Flex direction={"row"} gap={2}>
                  <Text color={bluefrance113}>Corriger la demande</Text>
                </Flex>
              </MenuButton>
              <MenuList p={0}>
                <MenuItem
                  px={2}
                  py={3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/intentions/saisie/${intention.numero}?correction=true`);
                  }}
                >
                  <Flex direction={"row"} h={"100%"} gap={2}>
                    <Icon icon="ri:scales-3-line" color={bluefrance113} width={"18px"} />
                    <Text color={bluefrance113}>Rectifier les capacités</Text>
                  </Flex>
                </MenuItem>
                <MenuItem
                  px={2}
                  py={3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenModalReport();
                  }}
                >
                  <Flex direction={"row"} h={"100%"} gap={2}>
                    <Icon icon="ri:corner-up-left-line" color={bluefrance113} width={"18px"} />
                    <Text color={bluefrance113}>Reporter la demande</Text>
                  </Flex>
                </MenuItem>
                <MenuItem
                  px={2}
                  py={3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenModalAnnulation();
                  }}
                >
                  <Flex direction={"row"} h={"100%"} gap={2}>
                    <Icon icon="ri:close-line" color={bluefrance113} width={"18px"} />
                    <Text color={bluefrance113}>Annuler la demande</Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        <Modal
          isOpen={isOpenModalReport}
          onClose={() => {
            onCloseModalReport();
            setReportDemandeStep(1);
          }}
          size={"xl"}
        >
          <ModalOverlay />
          {reportDemandeStep === 1 ? (
            <ModalContent p="4">
              <ModalCloseButton title="Fermer" />
              <ModalHeader>
                <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                Reporter la demande
              </ModalHeader>
              <ModalBody>
                <Text>
                  Reporter la demande indique que le projet sera mis en oeuvre ultérieurement. Une nouvelle saisie ou
                  une duplication devront avoir lieu lors d’une prochaine campagne.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Flex direction="row">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalReport();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setReportDemandeStep(2);
                    }}
                  >
                    Confirmer le report
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          ) : (
            <FormProvider {...formReport}>
              <ModalContent
                p="4"
                as="form"
                noValidate
                onSubmit={formReport.handleSubmit((correction) => {
                  submitCorrection({
                    body: {
                      correction: {
                        ...intention,
                        intentionNumero: intention.numero,
                        capaciteScolaireActuelle: intention.capaciteScolaireActuelle ?? 0,
                        capaciteScolaire: intention.capaciteScolaireActuelle ?? 0,
                        capaciteApprentissageActuelle: intention.capaciteApprentissageActuelle ?? 0,
                        capaciteApprentissage: intention.capaciteApprentissageActuelle ?? 0,
                        capaciteScolaireColoreeActuelle: 0,
                        capaciteScolaireColoree: 0,
                        capaciteApprentissageColoreeActuelle: 0,
                        capaciteApprentissageColoree: 0,
                        raison: "report",
                        motif: correction.motif,
                      },
                    },
                  });
                  onCloseModalReport();
                  setIsCorrected(true);
                })}
              >
                <ModalCloseButton title="Fermer" />
                <ModalHeader>
                  <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                  Merci de préciser le motif
                </ModalHeader>
                <ModalBody>
                  <FormControl isRequired>
                    <FormLabel mb={4}>
                      Pour quel motif êtes vous amené à modifier les capacités de cette intention ?
                    </FormLabel>
                    <Select
                      {...formReport.register("motif", {
                        required: "Veuillez choisir un motif",
                      })}
                      mb={4}
                    >
                      {
                        getMotifCorrectionOptionsParAnneeCampagne(campagne.annee as AnneeCampagneMotifCorrection).map(
                          (motif) => (
                            <option key={motif.value} value={motif.value}>
                              {motif.label}
                            </option>
                          ))
                      }
                    </Select>
                    {!!formReport.formState.errors.motif && (
                      <FormErrorMessage>{formReport.formState.errors.motif.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Commentaires / Observations sur la correction</FormLabel>
                    <Textarea
                      variant="grey"
                      height={150}
                      {...formReport.register("commentaire")}
                      placeholder="Merci de détailler les éléments de contexte de la correction"
                    />
                  </FormControl>
                  <Text my={4} color={"info.text"}>
                    Après validation de ce formulaire, vous ne pourrez plus apporter aucune modification
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalReport();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Valider le motif
                  </Button>
                </ModalFooter>
              </ModalContent>
            </FormProvider>
          )}
        </Modal>
        <Modal
          isOpen={isOpenModalAnnulation}
          onClose={() => {
            onCloseModalAnnulation();
            setAnnulationDemandeStep(1);
          }}
          size={"xl"}
        >
          <ModalOverlay />
          {annulationDemandeStep === 1 ? (
            <ModalContent p="4">
              <ModalCloseButton title="Fermer" />
              <ModalHeader>
                <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                Annuler la demande
              </ModalHeader>
              <ModalBody>
                <Text>Annuler la demande indique que le projet ne sera pas mis en oeuvre.</Text>
              </ModalBody>
              <ModalFooter>
                <Flex direction="row">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalAnnulation();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setAnnulationDemandeStep(2);
                    }}
                  >
                    Confirmer l'annulation
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          ) : (
            <FormProvider {...formAnnulation}>
              <ModalContent
                p="4"
                as="form"
                noValidate
                onSubmit={formAnnulation.handleSubmit((correction) => {
                  submitCorrection({
                    body: {
                      correction: {
                        ...intention,
                        intentionNumero: intention.numero,
                        capaciteScolaireActuelle: intention.capaciteScolaireActuelle ?? 0,
                        capaciteScolaire: intention.capaciteScolaireActuelle ?? 0,
                        capaciteApprentissageActuelle: intention.capaciteApprentissageActuelle ?? 0,
                        capaciteApprentissage: intention.capaciteApprentissageActuelle ?? 0,
                        capaciteScolaireColoreeActuelle: 0,
                        capaciteScolaireColoree: 0,
                        capaciteApprentissageColoreeActuelle: 0,
                        capaciteApprentissageColoree: 0,
                        raison: "annulation",
                        motif: correction.motif,
                      },
                    },
                  });
                  onCloseModalAnnulation();
                  setIsCorrected(true);
                })}
              >
                <ModalCloseButton title="Fermer" />
                <ModalHeader>
                  <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                  Merci de préciser le motif
                </ModalHeader>
                <ModalBody gap={6}>
                  <FormControl isRequired>
                    <FormLabel mb={4}>
                      Pour quel motif êtes vous amené à modifier les capacités de cette intention ?
                    </FormLabel>
                    <Select
                      {...formAnnulation.register("motif", {
                        required: "Veuillez choisir un role",
                      })}
                      isRequired={true}
                      mb={4}
                    >
                      {
                        getMotifCorrectionOptionsParAnneeCampagne(campagne.annee as AnneeCampagneMotifCorrection).map(
                          (motif) => (
                            <option key={motif.value} value={motif.value}>
                              {motif.label}
                            </option>
                          ))
                      }
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Commentaires / Observations sur la correction</FormLabel>
                    <Textarea
                      variant="grey"
                      height={150}
                      {...formAnnulation.register("commentaire")}
                      placeholder="Merci de détailler les éléments de contexte de la correction"
                    />
                  </FormControl>
                  <Text my={4} color={"info.text"}>
                    Après validation de ce formulaire, vous ne pourrez plus apporter aucune modification
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalAnnulation();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Valider le motif
                  </Button>
                </ModalFooter>
              </ModalContent>
            </FormProvider>
          )}
        </Modal>
      </>
    );
  }
);
