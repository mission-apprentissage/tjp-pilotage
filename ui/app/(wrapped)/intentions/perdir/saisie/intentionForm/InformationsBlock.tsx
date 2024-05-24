import { ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, RefObject, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { isTypeDiminution } from "shared/validators/demandeValidators";

import { client } from "@/api.client";

import { isTypeFermeture } from "../../../utils/typeDemandeUtils";
import { SectionBlock } from "../components/SectionBlock";
import { Campagne } from "../types";
import { IntentionForms } from "./defaultFormValues";
import { InternatEtRestaurationSection } from "./internatEtRestaurationSection/InternatEtRestaurationSection";
import { ObservationsSection } from "./observationsSection/ObservationsSection";
import { PrecisionsSection } from "./precisionsSection/PrecisionsSection";
import { RHSection } from "./rhSection/RHSection";
import { TravauxEtEquipementsSection } from "./travauxEtEquipementsSection/TravauxEtEquipementsSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  refs,
  formId,
  disabled,
  footerActions,
  campagne,
}: {
  refs: Record<string, RefObject<HTMLDivElement>>;
  formId?: string;
  disabled: boolean;
  footerActions: ReactNode;
  campagne?: Campagne;
}) => {
  const { push } = useRouter();
  const { setValue, watch } = useFormContext<IntentionForms>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading: isDeleting, mutateAsync: deleteDemande } = useMutation({
    mutationFn: async () => {
      if (!formId) return;
      await client
        .ref("[DELETE]/intention/:numero")
        .query({ params: { numero: formId } })
        .then(() => push("/intentions/saisie?action=supprimée"));
    },
  });

  useEffect(
    () =>
      watch(({ typeDemande }, { name }) => {
        if (
          name != "typeDemande" ||
          (typeDemande &&
            !isTypeFermeture(typeDemande) &&
            !isTypeDiminution(typeDemande))
        )
          return;
        setValue("amiCma", undefined);
        setValue("amiCmaValide", undefined);
        setValue("amiCmaValideAnnee", undefined);
        setValue("amiCmaEnCoursValidation", undefined);
        setValue("cmqImplique", undefined);
        setValue("nomCmq", undefined);
        setValue("partenairesEconomiquesImpliques", undefined);
        setValue("partenaireEconomique1", undefined);
        setValue("partenaireEconomique2", undefined);
        setValue("achatEquipement", undefined);
        setValue("achatEquipementDescription", undefined);
        setValue("travauxAmenagement", undefined);
        setValue("travauxAmenagementDescription", undefined);
        setValue("augmentationCapaciteAccueilHebergement", undefined);
        setValue("augmentationCapaciteAccueilHebergementPlaces", undefined);
        setValue("augmentationCapaciteAccueilHebergementPrecisions", undefined);
        setValue("augmentationCapaciteAccueilRestauration", undefined);
        setValue("augmentationCapaciteAccueilRestaurationPlaces", undefined);
        setValue(
          "augmentationCapaciteAccueilRestaurationPrecisions",
          undefined
        );
        setValue("recrutementRH", undefined);
        setValue("nbRecrutementRH", undefined);
        setValue("discipline1RecrutementRH", undefined);
        setValue("discipline2RecrutementRH", undefined);
        setValue("professeurAssocieRH", undefined);
        setValue("nbProfesseurAssocieRH", undefined);
        setValue("discipline1ProfesseurAssocieRH", undefined);
        setValue("discipline2ProfesseurAssocieRH", undefined);
        setValue("formationRH", undefined);
        setValue("nbFormationRH", undefined);
        setValue("discipline1FormationRH", undefined);
        setValue("discipline2FormationRH", undefined);
      }).unsubscribe
  );

  const typeDemande = watch("typeDemande");
  const sectionsTravauxInternatEtRestaurationVisible =
    !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

  return (
    <Flex direction="column" gap={6} mt={6}>
      <SectionBlock>
        <TypeDemandeSection
          typeDemandeRef={refs["typeDemande"]}
          disabled={disabled}
          campagne={campagne}
        />
      </SectionBlock>
      <SectionBlock>
        <PrecisionsSection
          motifsEtPrecisionsRef={refs["motifsEtPrecisions"]}
          disabled={disabled}
          campagne={campagne}
        />
      </SectionBlock>
      <SectionBlock>
        <RHSection
          ressourcesHumainesRef={refs["ressourcesHumaines"]}
          disabled={disabled}
        />
      </SectionBlock>
      {sectionsTravauxInternatEtRestaurationVisible && (
        <>
          <SectionBlock>
            <TravauxEtEquipementsSection
              travauxEtEquipementsRef={refs["travauxEtEquipements"]}
              disabled={disabled}
            />
          </SectionBlock>
          <SectionBlock>
            <InternatEtRestaurationSection
              internatEtRestaurationRef={refs["internatEtRestauration"]}
              disabled={disabled}
            />
          </SectionBlock>
        </>
      )}
      <SectionBlock>
        <ObservationsSection
          commentaireEtPiecesJointesRef={refs["commentaireEtPiecesJointes"]}
          disabled={disabled}
        />
      </SectionBlock>
      {formId && (
        <>
          <SectionBlock>
            <Flex justifyContent={"space-between"} flexDir={"row"}>
              <Button
                leftIcon={<DeleteIcon />}
                variant="ghost"
                color="bluefrance.113"
                onClick={onOpen}
                isDisabled={disabled}
              >
                Supprimer la demande
              </Button>
              <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent p="4">
                  <ModalCloseButton title="Fermer" />
                  <ModalHeader>
                    <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                    Confirmer la suppression de la demande
                  </ModalHeader>
                  <ModalBody>
                    <Text mb={4}>
                      Cette action est irréversible, elle supprime
                      définitivement la demande et l’ensemble des données
                      associées. Il est conseillé de réserver cette action à une
                      erreur de saisie ou un doublon.
                    </Text>
                    <Text>
                      Si vous souhaitez refuser la demande, vous pouvez la
                      conserver et modifier son statut en “Demande refusée”.
                    </Text>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={() => {
                        setValue("statut", DemandeStatutEnum["refusée"]);
                        onClose();
                      }}
                      variant={"secondary"}
                    >
                      Passer en "Demande refusée"
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        deleteDemande();
                      }}
                      isLoading={isDeleting}
                    >
                      Supprimer définitivement
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {footerActions && <Flex>{footerActions}</Flex>}
            </Flex>
          </SectionBlock>
        </>
      )}
      {!formId && footerActions && (
        <Flex justify="flex-end" mt="12" mb="4" gap={6}>
          {footerActions}
        </Flex>
      )}
    </Flex>
  );
};
