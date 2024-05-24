import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";

import { client } from "@/api.client";
import { CommentairesEtAvisSection } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/main/commentaireEtAvis/CommentairesEtAvisSection";
import { DisplayTypeEnum } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/main/displayTypeEnum";

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
  return (
    <Flex bg="white" borderRadius={6} p={8} direction="column">
      <Flex direction={"row"} justify={"space-between"}>
        <TabsSection
          displayType={displayType}
          displaySynthese={displaySynthese}
          displayCommentairesEtAvis={displayCommentairesEtAvis}
        />
        <Flex direction={"row"} gap={2}>
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
              isDisabled
              aria-label="Suivre la demande"
              color={"bluefrance.113"}
              bgColor={"transparent"}
              icon={<Icon width="24px" icon="ri:bookmark-line" />}
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
