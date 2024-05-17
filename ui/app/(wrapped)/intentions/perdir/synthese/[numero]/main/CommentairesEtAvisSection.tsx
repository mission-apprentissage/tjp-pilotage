import {
  Box,
  chakra,
  Divider,
  Flex,
  Heading,
  Highlight,
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
import { Fragment } from "react";

import { client } from "@/api.client";

import { getStepWorkflow } from "../../../../utils/statutUtils";
import { CommentaireSection } from "./CommentaireSection";

const StepIcon = chakra(
  ({ className, numero }: { className?: string; numero: number }) => (
    <Box
      className={className}
      w="32px"
      h="28px"
      borderRadius={"100%"}
      bgColor={"blueecume.925"}
    >
      <Text
        textAlign={"center"}
        fontSize={"18px"}
        fontWeight={700}
        color={"bluefrance.113"}
      >
        {numero}
      </Text>
    </Box>
  )
);

export const CommentairesEtAvisSection = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const getChangementStatutByEtape = (etape: 1 | 2 | 3) => {
    return intention?.changementsStatut?.filter(
      (changementStatut) => getStepWorkflow(changementStatut.statut) === etape
    );
  };

  const getNombreDifferentsContributeurs = (
    changementsStatut?: Array<{ userId: string }>
  ) => {
    if (!changementsStatut) return 0;
    return _.uniq(
      changementsStatut.map((changementStatut) => changementStatut.userId)
    ).length;
  };

  const etapes = [
    {
      numero: 3,
      label: "Les arbitrages et décisions de vote",
      changementsStatut: getChangementStatutByEtape(3),
    },
    {
      numero: 2,
      label: "Les avis de la phase d'instruction de projet",
      changementsStatut: getChangementStatutByEtape(2),
    },
    {
      numero: 1,
      label: "Les avis de la phase de revue des propositions",
      changementsStatut: getChangementStatutByEtape(1),
    },
  ];

  return (
    <Flex direction={"column"} gap={10}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Consulter les avis et commentaires sur la demande
      </Heading>
      {etapes
        .filter((etape) => etape.changementsStatut)
        .map((etape) => (
          <Flex key={etape.label} direction={"column"} gap={10}>
            <Divider />
            <Flex direction="row" gap={1}>
              <StepIcon numero={etape.numero} mb={"auto"} />
              <Flex ml={4} direction={"column"} gap={0} mb={"auto"}>
                <Text fontSize={18} fontWeight={700} lineHeight={"21px"}>
                  {etape.label}
                </Text>
                <Text
                  fontSize={14}
                  fontWeight={400}
                  lineHeight={"24px"}
                  color={"grey.200"}
                >
                  <Highlight
                    query={[
                      etape.changementsStatut?.length.toString() ?? "",
                      getNombreDifferentsContributeurs(
                        etape.changementsStatut
                      ).toString(),
                    ]}
                    styles={{
                      fontWeight: 700,
                    }}
                  >
                    {`${etape.changementsStatut
                      ?.length} changements de statut par ${getNombreDifferentsContributeurs(
                      etape.changementsStatut
                    )} contributeu`}
                  </Highlight>
                </Text>
              </Flex>
            </Flex>
            <Flex direction={"column"} gap={10}>
              {etape.changementsStatut?.map((changementStatut) => (
                <Fragment key={changementStatut.updatedAt}>
                  <CommentaireSection changementStatut={changementStatut} />
                </Fragment>
              ))}
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
