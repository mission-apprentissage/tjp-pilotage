import { Box, chakra, Divider, Flex, Heading, Highlight, Text } from "@chakra-ui/react";
import _ from "lodash";
import { Fragment } from "react";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { client } from "@/api.client";
import type { Avis, ChangementStatut } from "@/app/(wrapped)/demandes/types";
import {
  getOrderStatut,
  getStepWorkflow,
  getStepWorkflowAvis,
} from "@/app/(wrapped)/demandes/utils/statutUtils";

import { AvisSection } from "./AvisSection";
import { CommentaireSection } from "./CommentaireSection";
import { CompteursAvisSection } from "./CompteursAvisSection";

const StepIcon = chakra(({ className, numero }: { className?: string; numero: number }) => (
  <Box className={className} w="32px" h="28px" borderRadius={"100%"} bgColor={"blueecume.925"}>
    <Text textAlign={"center"} fontSize={"18px"} fontWeight={700} color={"bluefrance.113"}>
      {numero}
    </Text>
  </Box>
));

export const CommentairesEtAvisSection = ({
  demande,
}: {
  demande: (typeof client.infer)["[GET]/demande/:numero"];
}) => {
  const getCommentairesEtAvisByEtape = (etape: 1 | 2 | 3) => {
    const changementsStatut = getChangementStatutByEtape(etape);
    const avis = getAvisByEtape(etape);
    if (changementsStatut === undefined && avis === undefined) return [];
    if (avis === undefined) return _.orderBy(changementsStatut, (item) => item.updatedAt, "desc");
    if (changementsStatut === undefined) return _.orderBy(avis, (item) => item.updatedAt, "desc");
    return _.orderBy([...changementsStatut, ...avis], (item) => item.updatedAt, "desc");
  };

  const getChangementStatutByEtape = (etape: 1 | 2 | 3) => {
    return demande?.changementsStatut

      ?.filter((changementStatut) => {
        if (etape === 3 && getStepWorkflow(changementStatut.statut) === 4) return true;
        // Si la demande a été refusée à cette étape, on l'affiche
        if (
          getStepWorkflow(changementStatut.statutPrecedent) === etape &&
          changementStatut.statut === DemandeStatutEnum["refusée"]
        )
          return true;
        return getStepWorkflow(changementStatut.statut) === etape;
      })
      .sort((a, b) => getOrderStatut(b.statut) - getOrderStatut(a.statut));
  };

  const getAvisByEtape = (etape: 1 | 2 | 3) => {
    return demande?.avis?.filter((avis) => {
      if (etape === 3 && getStepWorkflowAvis(avis.typeAvis) === 4) return true;
      return getStepWorkflowAvis(avis.typeAvis) === etape;
    });
  };

  const getNombreDifferentsContributeurs = (commentairesEtAvis?: Array<{ createdBy: string }>) => {
    if (!commentairesEtAvis) return 0;
    return _.uniq(commentairesEtAvis.map((commentaireEtAvis) => commentaireEtAvis.createdBy)).length;
  };

  const etapes = [
    {
      numero: 3,
      label: "Les arbitrages et décisions de vote",
      commentairesEtAvis: getCommentairesEtAvisByEtape(3),
    },
    {
      numero: 2,
      label: "Les avis de la phase d'instruction de projet",
      commentairesEtAvis: getCommentairesEtAvisByEtape(2),
    },
    {
      numero: 1,
      label: "Les avis de la phase de revue des propositions",
      commentairesEtAvis: getCommentairesEtAvisByEtape(1),
    },
  ];

  return (
    <Flex direction={"column"} gap={10} width={"100%"}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Consulter les avis et commentaires sur la demande
      </Heading>
      <CompteursAvisSection demande={demande} />
      <Divider />

      {etapes.filter((etape) => etape?.commentairesEtAvis?.length).length ? (
        etapes
          .filter((etape) => etape?.commentairesEtAvis?.length)
          .map((etape) => (
            <Flex key={etape.label} direction={"column"} gap={10}>
              <Flex direction="row" gap={1}>
                <StepIcon numero={etape.numero} mb={"auto"} />
                <Flex ml={4} direction={"column"} gap={0} mb={"auto"}>
                  <Text fontSize={18} fontWeight={700} lineHeight={"21px"}>
                    {etape.label}
                  </Text>
                  <Text fontSize={14} fontWeight={400} lineHeight={"24px"} color={"grey.200"}>
                    <Highlight
                      query={[
                        etape.commentairesEtAvis?.length.toString() ?? "",
                        getNombreDifferentsContributeurs(etape.commentairesEtAvis).toString(),
                      ]}
                      styles={{
                        fontWeight: 700,
                      }}
                    >
                      {`${
                        etape.commentairesEtAvis?.length
                      } changement(s) de statut ou avis par ${getNombreDifferentsContributeurs(
                        etape.commentairesEtAvis
                      )} contributeur(s)`}
                    </Highlight>
                  </Text>
                </Flex>
              </Flex>
              <Flex direction={"column"}>
                {etape.commentairesEtAvis?.map((commentaireEtAvis) => (
                  <Fragment key={commentaireEtAvis.updatedAt}>
                    {Object.hasOwn(commentaireEtAvis, "statut") ? (
                      <CommentaireSection
                        changementStatut={commentaireEtAvis as ChangementStatut}
                        statut={demande.statut}
                      />
                    ) : (
                      <AvisSection avis={commentaireEtAvis as Avis} statut={demande.statut} />
                    )}
                  </Fragment>
                ))}
              </Flex>
            </Flex>
          ))
      ) : (
        <Heading as="h3" fontSize={16} fontWeight={700}>
          Pas encore de changement de statut ou d'avis sur la demande
        </Heading>
      )}
    </Flex>
  );
};
