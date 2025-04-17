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
import {useRouter} from 'next/navigation';
import type { ReactNode, RefObject } from "react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";
import {isTypeAjustement,isTypeDiminution, isTypeFermeture} from 'shared/utils/typeDemandeUtils';

import { client } from "@/api.client";
import { SectionBlock } from "@/app/(wrapped)/demandes/saisie/components/SectionBlock";
import type {Demande} from '@/app/(wrapped)/demandes/types';

import { CorrectionSection } from './correctionSection/CorrectionSection';
import { InternatEtRestaurationSection } from "./internatEtRestaurationSection/InternatEtRestaurationSection";
import { ObservationsSection } from "./observationsSection/ObservationsSection";
import { PrecisionsSection } from "./precisionsSection/PrecisionsSection";
import { RHSection } from "./rhSection/RHSection";
import {StatusBlock} from './statutSection/StatusBlock';
import { TravauxEtEquipementsSection } from "./travauxEtEquipementsSection/TravauxEtEquipementsSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";
import type { DemandeFormType } from "./types";

export const InformationsBlock = ({
  refs,
  formId,
  disabled,
  footerActions,
  campagne,
  demande,
  showCorrection
}: {
  refs: Record<string, RefObject<HTMLDivElement>>;
  formId?: string;
  disabled: boolean;
  footerActions: ReactNode;
  campagne: CampagneType;
  demande?: Demande;
  showCorrection?: boolean;
}) => {
  const { push } = useRouter();
  const { setValue, watch } = useFormContext<DemandeFormType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading: isDeleting, mutateAsync: deleteDemande } = useMutation({
    mutationFn: async () => {
      if (!formId) return;
      await client
        .ref("[DELETE]/demande/:numero")
        .query({ params: { numero: formId } })
        .then(() => push("/intentions/saisie?action=supprimée"));
    },
  });

  useEffect(
    () =>
      watch(({ typeDemande }, { name }) => {
        if (name != "typeDemande" || (typeDemande && !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande)))
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
        setValue("augmentationCapaciteAccueilRestaurationPrecisions", undefined);
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

  useEffect(() => {
    refs["correction"].current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCorrection]);

  const isOldDemande = (demande && !!demande.isOldDemande);
  const isDemande = (demande && !demande.isOldDemande);

  const sectionsTravauxInternatEtRestaurationVisible = (
    !isTypeFermeture(typeDemande) &&
    !isTypeDiminution(typeDemande) &&
    isOldDemande
  );

  const sectionStatutVisible = !isTypeAjustement(typeDemande) && isDemande;

  return (
    <Flex direction="column" gap={6} mt={6}>
      <SectionBlock>
        <TypeDemandeSection typeDemandeRef={refs["typeDemande"]} disabled={disabled} demande={demande} campagne={campagne} />
      </SectionBlock>
      {showCorrection && (
        <SectionBlock borderColor={"red"} borderWidth={"1px"}>
          <CorrectionSection correctionRef={refs["correction"]} demande={demande!} campagne={campagne} />
        </SectionBlock>
      )}
      <SectionBlock>
        <PrecisionsSection motifsEtPrecisionsRef={refs["motifsEtPrecisions"]} disabled={disabled} campagne={campagne} />
      </SectionBlock>
      <SectionBlock>
        <RHSection ressourcesHumainesRef={refs["ressourcesHumaines"]} disabled={disabled} />
      </SectionBlock>
      {sectionsTravauxInternatEtRestaurationVisible && (
        <>
          <SectionBlock>
            <TravauxEtEquipementsSection travauxEtEquipementsRef={refs["travauxEtEquipements"]} disabled={disabled} />
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
        <ObservationsSection commentaireEtPiecesJointesRef={refs["commentaireEtPiecesJointes"]} disabled={disabled} />
      </SectionBlock>
      <SectionBlock>
        <Flex justifyContent={"space-between"} flexDir={"row"}>
          {formId && (
            <Button
              leftIcon={<DeleteIcon />}
              variant="ghost"
              color="bluefrance.113"
              onClick={onOpen}
              isDisabled={disabled}
            >
              Supprimer la demande
            </Button>
          )}
          {footerActions && <Flex ms={"auto"}>{footerActions}</Flex>}
        </Flex>
      </SectionBlock>
      {sectionStatutVisible && (
        <SectionBlock>
          <StatusBlock disabled={disabled} />
        </SectionBlock>
      )}
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
              Cette action est irréversible, elle supprime définitivement la demande et l’ensemble des données
              associées. Il est conseillé de réserver cette action à une erreur de saisie ou un doublon.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
              }}
              variant={"secondary"}
            >
              Annuler
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
    </Flex>
  );
};
