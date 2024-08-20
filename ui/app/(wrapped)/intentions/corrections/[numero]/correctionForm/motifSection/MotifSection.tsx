import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { Campagne } from "../types";
import { AutreMotifField } from "./AutreMotifField";
import { CommentaireField } from "./CommentaireField";
import { MotifField } from "./MotifField";
import { RaisonField } from "./RaisonField";

export const MotifSection = ({ campagne }: { campagne?: Campagne }) => {
  return (
    <Flex direction={"column"}>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Icon
            icon="ri:list-unordered"
            color="black"
            style={{ marginTop: "auto" }}
          />
          Motifs de votre correction
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap="8" mb="4" direction={"column"}>
        <RaisonField campagne={campagne} />
        <MotifField mb="4" campagne={campagne} />
        <AutreMotifField mb="4" />
        <CommentaireField mb="4" />
      </Flex>
    </Flex>
  );
};
