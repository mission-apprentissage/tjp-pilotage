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
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, RefObject, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { feature } from "@/utils/feature";

import { isTypeAjustement } from "../../utils/typeDemandeUtils";
import { SectionBlock } from "../components/SectionBlock";
import { CorrectionSection } from "../intentionForm/correctionSection/CorrectionSection";
import { Campagne, Demande } from "../types";
import { IntentionForms } from "./defaultFormValues";
import { ObservationsSection } from "./observationsSection/ObservationsSection";
import { PrecisionsSection } from "./precisionsSection/PrecisionsSection";
import { RHSection } from "./rhSection/RHSection";
import { StatusBlock } from "./statutSection/StatusBlock";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  refs,
  formId,
  disabled,
  footerActions,
  campagne,
  demande,
}: {
  refs: Record<string, RefObject<HTMLDivElement>>;
  formId?: string;
  disabled: boolean;
  footerActions: ReactNode;
  campagne?: Campagne;
  demande?: Demande;
}) => {
  const { push } = useRouter();
  const { setValue, watch } = useFormContext<IntentionForms>();
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

  const queryParams = useSearchParams();
  const isCorrection = queryParams.get("correction");
  const typeDemande = watch("typeDemande");

  useEffect(() => {
    refs["correction"].current?.scrollIntoView({ behavior: "smooth" });
  }, [isCorrection]);

  return (
    <Flex direction="column" gap={6} mt={6}>
      <SectionBlock>
        <TypeDemandeSection
          typeDemandeRef={refs["typeDemande"]}
          disabled={disabled}
          campagne={campagne}
          demande={demande}
        />
      </SectionBlock>
      {feature.correction && isCorrection && demande && (
        <SectionBlock borderColor={"red"} borderWidth={"1px"}>
          <CorrectionSection
            correctionRef={refs["correction"]}
            demande={demande}
            campagne={campagne}
          />
        </SectionBlock>
      )}
      <SectionBlock>
        <PrecisionsSection
          motifsEtPrecisionsRef={refs["motifsEtPrecisions"]}
          campagne={campagne}
          disabled={disabled}
        />
      </SectionBlock>
      <SectionBlock>
        <RHSection
          ressourcesHumainesRef={refs["ressourcesHumaines"]}
          disabled={disabled}
        />
      </SectionBlock>
      <SectionBlock>
        <ObservationsSection
          commentaireEtPiecesJointesRef={refs["commentaireEtPiecesJointes"]}
          disabled={disabled}
        />
      </SectionBlock>
      {formId && (
        <>
          {!isTypeAjustement(typeDemande) && (
            <SectionBlock>
              <StatusBlock disabled={disabled} />
            </SectionBlock>
          )}
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
        <Flex justify="flex-end" mt={6} mb="4" gap={6}>
          {footerActions}
        </Flex>
      )}
    </Flex>
  );
};
