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

  const getNombreDifferentsContributeurs = (changementsStatutEtAvis?: Array<{ createdBy: string }>) => {
    if (!changementsStatutEtAvis) return 0;
    return _.uniq(changementsStatutEtAvis.map((changementsStatutEtAvis) => changementsStatutEtAvis.createdBy)).length;
  };

  const etapes = [
    {
      numero: 3,
      label: "Les arbitrages et décisions de vote",
      changementsStatutEtAvis: getChangementStatutEtAvisByEtape(3),
    },
    {
      numero: 2,
      label: "Les avis de la phase d'instruction de projet",
      changementsStatutEtAvis: getChangementStatutEtAvisByEtape(2),
    },
    {
      numero: 1,
      label: "Les avis de la phase de revue des propositions",
      changementsStatutEtAvis: getChangementStatutEtAvisByEtape(1),
    },
  ];

  return (
    <Flex direction={"column"} gap={10} width={"100%"}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Consulter les changement(s) de statut et avis sur la demande
      </Heading>
      <CompteursAvisSection demande={demande} />
      <Divider />

      {etapes.filter((etape) => etape?.changementsStatutEtAvis?.length).length ? (
        etapes
          .filter((etape) => etape?.changementsStatutEtAvis?.length)
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
                        etape.changementsStatutEtAvis?.length.toString() ?? "",
                        getNombreDifferentsContributeurs(etape.changementsStatutEtAvis).toString(),
                      ]}
                      styles={{
                        fontWeight: 700,
                      }}
                    >
                      {`${
                        etape.changementsStatutEtAvis?.length
                      } changement(s) de statut ou avis par ${getNombreDifferentsContributeurs(
                        etape.changementsStatutEtAvis
                      )} contributeur(s)`}
                    </Highlight>
                  </Text>
                </Flex>
              </Flex>
              <Flex direction={"column"}>
                {etape.changementsStatutEtAvis?.map((changementStatutEtAvis) => (
                  <Fragment key={changementStatutEtAvis.updatedAt}>
                    {Object.hasOwn(changementStatutEtAvis, "statut") ? (
                      <CommentaireSection
                        changementStatut={changementStatutEtAvis as ChangementStatut}
                        demande={demande}
                      />
                    ) : (
                      <AvisSection avis={changementStatutEtAvis as Avis} demande={demande} />
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
