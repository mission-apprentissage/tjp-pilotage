import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { RefObject } from "react";

import { SCROLL_OFFSET } from "../../SCROLL_OFFSETS";
import { CommentaireField } from "./CommentaireField";

export const ObservationsSection = ({
  disabled,
  commentaireEtPiecesJointesRef,
}: {
  disabled: boolean;
  commentaireEtPiecesJointesRef: RefObject<HTMLDivElement>;
}) => (
  <Flex
    ref={commentaireEtPiecesJointesRef}
    scrollMarginTop={SCROLL_OFFSET}
    direction="column"
  >
    <Heading as="h2" fontSize="xl" display={"flex"}>
      <Flex direction={"row"} gap={3}>
        <Icon
          icon="ri:chat-3-line"
          color="black"
          style={{ marginTop: "auto" }}
        />
        Observations sur la demande
      </Flex>
    </Heading>
    <Divider pt="4" mb="4" />
    <CommentaireField disabled={disabled} />
  </Flex>
);
