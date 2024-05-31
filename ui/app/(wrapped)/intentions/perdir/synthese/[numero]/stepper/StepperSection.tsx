import { Flex, Grid, GridItem, Img } from "@chakra-ui/react";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { getStepWorkflow } from "@/app/(wrapped)/intentions/utils/statutUtils";

import { Step } from "./Step";

export const StepperSection = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  return (
    <Flex bg="white" borderRadius={6} p={8}>
      <Grid templateColumns={"repeat(4, 1fr)"} gap={8}>
        <GridItem>
          <Step
            etape={1}
            currentEtape={getStepWorkflow(intention.statut)}
            titre="Revue de la proposition"
            dateDebut="03/06/2024"
            dateFin="15/08/2024"
            description="Vérification de la complétude du dossier et première évaluation de la faisabilité"
            incomplet={
              intention.statut === DemandeStatutEnum["dossier incomplet"]
            }
          />
        </GridItem>
        <GridItem>
          <Step
            etape={2}
            currentEtape={getStepWorkflow(intention.statut)}
            titre="Instruction du projet"
            dateDebut="XX/XX/2024"
            dateFin="XX/XX/2024"
            description="Éclairage de chaque dossier par des avis experts/pilotes afin de faciliter la décision"
          />
        </GridItem>
        <GridItem>
          <Step
            etape={3}
            currentEtape={getStepWorkflow(intention.statut)}
            titre="Phase de vote"
            dateDebut="XX/XX/2024"
            dateFin="XX/XX/2024"
            description="Dernière phase d'étude du dossier pour arbitrage, votes et décisions finales"
          />
        </GridItem>
        <GridItem>
          <Img
            src={`/illustrations/step-${
              getStepWorkflow(intention.statut) != 0
                ? getStepWorkflow(intention.statut)
                : "1"
            }-workflow-intentions.svg`}
            alt="Illustration de l'étape en cours"
            m={"auto"}
          />
        </GridItem>
      </Grid>
    </Flex>
  );
};
