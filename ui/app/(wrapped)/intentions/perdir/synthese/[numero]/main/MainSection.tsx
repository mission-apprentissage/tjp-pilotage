import { Flex, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";

import { client } from "@/api.client";
import { CommentairesEtAvisSection } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/main/commentaireEtAvis/CommentairesEtAvisSection";
import { DisplayTypeEnum } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/main/displayTypeEnum";
import { usePermission } from "@/utils/security/usePermission";

import { canEditIntention } from "../../../saisie/utils/canEditIntention";
import { SyntheseSection } from "./synthese/SyntheseSection";
import { TabsSection } from "./TabsSection";

export const MainSection = ({
  intention,
  displayType,
  displaySynthese,
  displayCommentairesEtAvis,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
  displayType: DisplayTypeEnum;
  displaySynthese: () => void;
  displayCommentairesEtAvis: () => void;
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const hasEditIntentionPermission = usePermission(
    "intentions-perdir/ecriture"
  );

  const { mutate: submitSuivi } = client
    .ref("[POST]/intention/suivi")
    .useMutation({
      onSuccess: (_body) => {
        toast({
          variant: "left-accent",
          status: "success",
          title: "La demande a bien été ajoutée à vos demandes suivies",
        });
        // Wait until view is updated before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries(["[GET]/intention/:numero"]);
        }, 500);
      },
    });

  const { mutate: deleteSuivi } = client
    .ref("[DELETE]/intention/suivi/:id")
    .useMutation({
      onSuccess: (_body) => {
        toast({
          variant: "left-accent",
          status: "success",
          title: "La demande a bien été supprimée de vos demandes suivies",
        });
        // Wait until view is updated before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries(["[GET]/intention/:numero"]);
        }, 500);
      },
    });

  return (
    <Flex bg="white" borderRadius={6} p={8} direction="column">
      <Flex direction={"row"} justify={"space-between"}>
        <TabsSection
          displayType={displayType}
          displaySynthese={displaySynthese}
          displayCommentairesEtAvis={displayCommentairesEtAvis}
        />
        <Flex direction={"row"} gap={2}>
          {canEditIntention({ intention, hasEditIntentionPermission }) && (
            <Tooltip label="Modifier la demande">
              <IconButton
                as={NextLink}
                href={`/intentions/perdir/saisie/${intention?.numero ?? ""}`}
                aria-label="Modifier la demande"
                color={"bluefrance.113"}
                bgColor={"transparent"}
                icon={<Icon width="24px" icon="ri:pencil-line" />}
              />
            </Tooltip>
          )}
          <Tooltip label="Dupliquer la demande">
            <IconButton
              isDisabled
              aria-label="Dupliquer la demande"
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={<Icon width="24px" icon="ri:device-line" />}
            />
          </Tooltip>
          <Tooltip label="Suivre la demande">
            <IconButton
              aria-label="Suivre la demande"
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={
                intention.suiviId ? (
                  <Icon width="24px" icon="ri:bookmark-fill" />
                ) : (
                  <Icon width="24px" icon="ri:bookmark-line" />
                )
              }
              onClick={() => {
                if (!intention.suiviId)
                  submitSuivi({
                    body: { intentionNumero: intention.numero },
                  });
                else
                  deleteSuivi({
                    params: { id: intention.suiviId },
                  });
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Flex mt={8}>
        {displayType === DisplayTypeEnum.synthese ? (
          <SyntheseSection intention={intention} />
        ) : displayType === DisplayTypeEnum.commentairesEtAvis ? (
          <CommentairesEtAvisSection intention={intention} />
        ) : null}
      </Flex>
    </Flex>
  );
};
