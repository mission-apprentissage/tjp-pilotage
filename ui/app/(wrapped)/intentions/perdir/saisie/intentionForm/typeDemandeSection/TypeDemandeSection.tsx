import { Box, Button, chakra, Divider, Flex, Heading, Highlight, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { RefObject } from "react";
import { useState } from "react";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import type { Campagne } from "@/app/(wrapped)/intentions/perdir/saisie/types";
import { SCROLL_OFFSET } from "@/app/(wrapped)/intentions/perdir/SCROLL_OFFSETS";
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";

const InfoAjustementSection = chakra(({ anneeCampagne }: { anneeCampagne: string }) => {
  const [open, setOpen] = useState(true);
  return (
    <Box
      backgroundColor={themeDefinition.colors.info[950]}
      color={themeDefinition.colors.info.text}
      width="100%"
      paddingY="12px"
      display={open ? "block" : "none"}
    >
      <Stack
        maxWidth={"container.xl"}
        margin="auto"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        flexWrap="nowrap"
        spacing="3"
        padding="4px 8px"
      >
        <Icon icon="ri:information-fill" fontSize="24px" />
        <Text
          flexGrow={1}
          fontSize="14px"
          fontWeight={400}
          display={{
            base: "none",
            md: "block",
          }}
        >
          <Highlight
            query={`${anneeCampagne}`}
            styles={{
              color: "inherit",
              fontWeight: 700,
            }}
          >
            {`Pour apporter un ajustement à la rentrée scolaire ${anneeCampagne}, sélectionner ${anneeCampagne} dans le champ ci-dessus`}
          </Highlight>
        </Text>
        <Button
          onClick={() => setOpen(false)}
          variant="inline"
          display="flex"
          padding="0"
          flexDirection="row"
          justifyItems="end"
          alignItems="start"
          width="auto"
          height="auto"
        >
          <Icon icon="ri:close-fill" fontSize="24px" />
        </Button>
      </Stack>
    </Box>
  );
});
export const TypeDemandeSection = ({
  disabled,
  campagne,
  typeDemandeRef,
}: {
  disabled: boolean;
  campagne?: Campagne;
  typeDemandeRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <Flex ref={typeDemandeRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"} gap={6}>
      <Heading as="h2" fontSize="xl">
        <Flex direction={"row"} gap={3}>
          <Icon icon="ri:article-line" color="black" style={{ marginTop: "auto" }} />
          Type de demande
        </Flex>
      </Heading>
      <Divider />
      <RentreeScolaireField disabled={disabled} campagne={campagne} />
      <InfoAjustementSection anneeCampagne={campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE} />
      <TypeDemandeField disabled={disabled} />
      <Tooltip label="Pour transférer des places d’un établissement vers un autre, vous devez faire 2 demandes : une fermeture dans l’établissement initial, et une ouverture dans le nouvel établissement (plusieurs demandes d’ouverture si les places sont transférées à plusieurs établissements)">
        <Flex
          direction={"row"}
          gap={2}
          color={"bluefrance.113"}
          textDecoration={"underline"}
          cursor={"pointer"}
          fontWeight={"700"}
          width={"fit-content"}
        >
          <TooltipIcon mt={"1"} />
          <Text>Vous cherchez à faire un transfert de places entre établissements ?</Text>
        </Flex>
      </Tooltip>
      <CapaciteSection disabled={disabled} />
    </Flex>
  );
};
