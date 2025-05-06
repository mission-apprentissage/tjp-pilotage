import { chakra, Flex, Grid, GridItem, Img, Text } from "@chakra-ui/react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { TypeAvisType } from "shared/enum/typeAvisEnum";
import { TypeAvisEnum } from "shared/enum/typeAvisEnum";

import type { client } from "@/api.client";
import { getOrderStatut, getStepWorkflow, getTypeAvis } from "@/app/(wrapped)/demandes/utils/statutUtils";

import { Step } from "./Step";

const IllustrationStatut = chakra(
  ({ statut, latestTypeAvis }: { statut?: DemandeStatutType; latestTypeAvis?: TypeAvisType }) => {
    let phaseRefus = "de vote";
    if (latestTypeAvis === TypeAvisEnum["préalable"]) phaseRefus = "de revue de la proposition";
    else if (latestTypeAvis === TypeAvisEnum["consultatif"]) phaseRefus = "d'instruction";

    switch (statut) {
    case DemandeStatutEnum["demande validée"]:
      return (
        <Flex
          w={"100%"}
          h={"100%"}
          bgColor={"success.950"}
          textAlign={"center"}
          flexDirection={"column"}
          p={5}
          fontSize={"16px"}
          borderRadius={"4px"}
          gap={3}
        >
          <Text color={"success.425"} fontWeight={700}>
              Demande validée
          </Text>
          <Text>La demande a été validée à l'issue de la concertation finale</Text>
        </Flex>
      );
    case DemandeStatutEnum["refusée"]:

      return (
        <Flex
          w={"100%"}
          h={"100%"}
          bgColor={"error.950"}
          textAlign={"center"}
          flexDirection={"column"}
          p={5}
          fontSize={"16px"}
          borderRadius={"4px"}
          gap={3}
        >
          <Text color={"error.425"} fontWeight={700}>
              Demande refusée
          </Text>
          <Text>
              La demande a été refusée à l'issue de la phase {phaseRefus}
          </Text>
        </Flex>
      );
    case DemandeStatutEnum["dossier incomplet"]:
      return (
        <Flex
          w={"100%"}
          h={"100%"}
          bgColor={"error.950"}
          textAlign={"center"}
          flexDirection={"column"}
          p={5}
          fontSize={"16px"}
          borderRadius={"4px"}
          gap={3}
        >
          <Text color={"error.425"} fontWeight={700}>
              Dossier incomplet
          </Text>
          <Text>Le dossier doit être complété pour passer en phase d'instruction</Text>
        </Flex>
      );
    case DemandeStatutEnum["brouillon"]:
      return (
        <Img
          src={`/illustrations/step-1-workflow-demandes.svg`}
          alt="Illustration de l'étape en cours"
          m={"auto"}
        />
      );
    case DemandeStatutEnum["proposition"]:
    case DemandeStatutEnum["dossier complet"]:
    case DemandeStatutEnum["projet de demande"]:
    case DemandeStatutEnum["prêt pour le vote"]:
    case DemandeStatutEnum["supprimée"]:
    default:
      return (
        <Img
          src={`/illustrations/step-${getStepWorkflow(statut)}-workflow-demandes.svg`}
          alt="Illustration de l'étape en cours"
          m={"auto"}
        />
      );
    }
  }
);

export const StepperSection = ({ demande }: { demande: (typeof client.infer)["[GET]/demande/:numero"] }) => {
  const previousStep = getStepWorkflow(
    (demande.changementsStatut ?? []).sort((a, b) => getOrderStatut(b.statut) - getOrderStatut(a.statut))[0]
      ?.statutPrecedent
  );

  const latestTypeAvis = getTypeAvis(
    (demande.changementsStatut ?? []).sort((a, b) => getOrderStatut(b.statut) - getOrderStatut(a.statut))[0]
      ?.statutPrecedent
  );

  const isStepIncomplete = (step: number) => {
    switch (step) {
    case 1:
      return (
        demande?.statut === DemandeStatutEnum["dossier incomplet"] ||
          (demande?.statut === DemandeStatutEnum["refusée"] && previousStep === 1)
      );
    case 2:
      return demande?.statut === DemandeStatutEnum["refusée"] && previousStep === 2;
    case 3:
      return demande?.statut === DemandeStatutEnum["refusée"] && previousStep === 3;
    default:
      return false;
    }
  };

  return (
    <Flex bg="white" borderRadius={6} p={8}>
      <Grid templateColumns={"repeat(4, 1fr)"} gap={8}>
        <GridItem>
          <Step
            etape={1}
            currentEtape={getStepWorkflow(demande.statut)}
            titre="Revue de la proposition"
            description="Vérification de la complétude du dossier et première évaluation de la faisabilité"
            incomplet={isStepIncomplete(1)}
          />
        </GridItem>
        <GridItem>
          <Step
            etape={2}
            currentEtape={getStepWorkflow(demande.statut)}
            titre="Instruction du projet"
            description="Éclairage de chaque dossier par des avis experts/pilotes afin de faciliter la décision"
            incomplet={isStepIncomplete(2)}
          />
        </GridItem>
        <GridItem>
          <Step
            etape={3}
            currentEtape={getStepWorkflow(demande.statut)}
            titre="Phase de vote"
            description="Dernière phase d'étude du dossier pour arbitrage, votes et décisions finales"
            incomplet={isStepIncomplete(3)}
          />
        </GridItem>
        <GridItem>
          <IllustrationStatut statut={demande.statut} latestTypeAvis={latestTypeAvis} />
        </GridItem>
      </Grid>
    </Flex>
  );
};
