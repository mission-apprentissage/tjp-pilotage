import { Flex } from "@chakra-ui/react";

import { ChiffresEntree, ChiffresIJ } from "../types";
import { AttractiviteSection } from "./attractivite/AttractiviteSection";
import { DevenirSection } from "./devenir/DevenirSection";
import { EffectifSection } from "./effectifs/EffectifSection";

export const Dashboard = ({
  chiffresIj,
  chiffresEntree,
}: {
  chiffresIj?: ChiffresIJ;
  chiffresEntree?: ChiffresEntree;
}) => {
  return (
    <Flex flexDirection={"column"} mr={8} gap={8}>
      <DevenirSection chiffresIj={chiffresIj} />
      <AttractiviteSection chiffresEntree={chiffresEntree} />
      <EffectifSection chiffresEntree={chiffresEntree} />
    </Flex>
  );
};
