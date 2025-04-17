import { Flex, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import { isCampagneEnCours } from "shared/utils/campagneUtils";

import { client } from "@/api.client";
import { canEditDemande } from "@/app/(wrapped)/demandes/utils/permissionsDemandeUtils";
import {getRoutingSaisieRecueilDemande} from '@/utils/getRoutingRecueilDemande';
import { useAuth } from "@/utils/security/useAuth";

import { CommentairesEtAvisSection } from "./commentaireEtAvis/CommentairesEtAvisSection";
import { DisplayTypeEnum } from "./displayTypeEnum";
import { SyntheseSection } from "./synthese/SyntheseSection";
import { TabsSection } from "./TabsSection";

export const MainSection = ({
  demande,
  displayType,
  displaySynthese,
  displayCommentairesEtAvis,
}: {
  demande: (typeof client.infer)["[GET]/demande/:numero"];
  displayType: DisplayTypeEnum;
  displaySynthese: () => void;
  displayCommentairesEtAvis: () => void;
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: submitSuivi } = client.ref("[POST]/demande/suivi").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été ajoutée à vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries(["[GET]/demande/:numero"]);
      }, 500);
    },
  });

  const { mutate: deleteSuivi } = client.ref("[DELETE]/demande/suivi/:id").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été supprimée de vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries(["[GET]/demande/:numero"]);
      }, 500);
    },
  });

  return (
    <Flex bg="white" borderRadius={6} p={8} direction="column">
      {isCampagneEnCours(demande.campagne) && (
        <Flex direction={"row"} justify={"space-between"}>
          <TabsSection
            displayType={displayType}
            displaySynthese={displaySynthese}
            displayCommentairesEtAvis={displayCommentairesEtAvis}
          />
          <Flex direction={"row"} gap={2}>
            {canEditDemande({demande, user}) && (
              <Tooltip label="Modifier la demande">
                <IconButton
                  as={NextLink}
                  href={getRoutingSaisieRecueilDemande({
                    user,
                    suffix: demande?.numero
                  })}
                  aria-label="Modifier la demande"
                  color={"bluefrance.113"}
                  bgColor={"transparent"}
                  icon={<Icon width="24px" icon="ri:pencil-line" />}
                />
              </Tooltip>
            )}
            <Tooltip label="Suivre la demande">
              <IconButton
                aria-label="Suivre la demande"
                color={"bluefrance.113"}
                bgColor={"transparent"}
                icon={
                  demande.suiviId ? (
                    <Icon width="24px" icon="ri:bookmark-fill" />
                  ) : (
                    <Icon width="24px" icon="ri:bookmark-line" />
                  )
                }
                onClick={() => {
                  if (!demande.suiviId)
                    submitSuivi({
                      body: { demandeNumero: demande.numero },
                    });
                  else
                    deleteSuivi({
                      params: { id: demande.suiviId },
                    });
                }}
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}
      <Flex mt={8}>
        {displayType === DisplayTypeEnum.synthese ? (
          <SyntheseSection demande={demande} />
        ) : displayType === DisplayTypeEnum.commentairesEtAvis ? (
          <CommentairesEtAvisSection demande={demande} />
        ) : null}
      </Flex>
    </Flex>
  );
};
