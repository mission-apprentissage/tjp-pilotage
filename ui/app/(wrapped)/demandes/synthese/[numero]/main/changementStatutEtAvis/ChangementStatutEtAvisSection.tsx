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
import { CommentaireSection } from "./ChangementStatutSection";
import { CompteursAvisSection } from "./CompteursAvisSection";

const StepIcon = chakra(({ className, numero }: { className?: string; numero: number }) => (
  <Box className={className} w="32px" h="28px" borderRadius={"100%"} bgColor={"blueecume.925"}>
    <Text textAlign={"center"} fontSize={"18px"} fontWeight={700} color={"bluefrance.113"}>
      {numero}
    </Text>
  </Box>
));

type Etape = 1 | 2 | 3;

export const ChangementStatutEtAvisSection = ({
  demande,
}: {
  demande: (typeof client.infer)["[GET]/demande/:numero"];
}) => {
  const getChangementStatutEtAvisByEtape = (etape: Etape) => {
    const changementsStatut = getChangementStatutByEtape(etape);
    const avis = getAvisByEtape(etape);
    if (changementsStatut === undefined && avis === undefined) return [];
    if (avis === undefined) return _.orderBy(changementsStatut, (item) => item.updatedAt, "desc");
    if (changementsStatut === undefined) return _.orderBy(avis, (item) => item.updatedAt, "desc");
    return _.orderBy([...changementsStatut, ...avis], (item) => item.updatedAt, "desc");
  };

  const getChangementStatutByEtape = (etape: Etape) => {
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

  const getAvisByEtape = (etape: Etape) => {
    return demande?.avis?.filter((avis) => {
      if (etape === 3 && getStepWorkflowAvis(avis.typeAvis) === 4) return true;
      return getStepWorkflowAvis(avis.typeAvis) === etape;
    });
  };

  const getNombreDifferentsContributeurs = (changementStatutEtAvis?: Array<{ createdBy: string }>) => {
    if (!changementStatutEtAvis) return 0;
    return _.uniq(changementStatutEtAvis.map((commentaireEtAvis) => commentaireEtAvis.createdBy)).length;
  };

  const etapes = [
    {
      numero: 3,
      label: "Les arbitrages et décisions de vote",
      changementStatutEtAvis: getChangementStatutEtAvisByEtape(3),
    },
    {
      numero: 2,
      label: "Les avis de la phase d'instruction de projet",
      changementStatutEtAvis: getChangementStatutEtAvisByEtape(2),
    },
    {
      numero: 1,
      label: "Les avis de la phase de revue des propositions",
      changementStatutEtAvis: getChangementStatutEtAvisByEtape(1),
    },
  ];

  return (
    <Flex direction={"column"} gap={10} width={"100%"}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Consulter les avis et changementStatut sur la demande
      </Heading>
      <CompteursAvisSection demande={demande} />
      <Divider />

      {etapes.filter((etape) => etape?.changementStatutEtAvis?.length).length ? (
        etapes
          .filter((etape) => etape?.changementStatutEtAvis?.length)
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
                        etape.changementStatutEtAvis?.length.toString() ?? "",
                        getNombreDifferentsContributeurs(etape.changementStatutEtAvis).toString(),
                      ]}
                      styles={{
                        fontWeight: 700,
                      }}
                    >
                      {`${
                        etape.changementStatutEtAvis?.length
                      } changement(s) de statut ou avis par ${getNombreDifferentsContributeurs(
                        etape.changementStatutEtAvis
                      )} contributeur(s)`}
                    </Highlight>
                  </Text>
                </Flex>
              </Flex>
              <Flex direction={"column"}>
                {etape.changementStatutEtAvis?.map((commentaireEtAvis) => (
                  <Fragment key={commentaireEtAvis.updatedAt}>
                    {Object.hasOwn(commentaireEtAvis, "statut") ? (
                      <CommentaireSection
                        changementStatut={commentaireEtAvis as ChangementStatut}
                        demande={demande}
                      />
                    ) : (
                      <AvisSection avis={commentaireEtAvis as Avis} demande={demande} />
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
