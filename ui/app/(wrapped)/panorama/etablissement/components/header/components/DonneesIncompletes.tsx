import { Box, Button, Flex, GridItem, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const DonneesIncompletes = ({ isMissingDatas }: { isMissingDatas: boolean }) => {
  if (!isMissingDatas) {
    return null;
  }

  return (
    <GridItem
      colSpan={12}
      bgColor={"grey.975"}
      borderLeft={"4px solid bluefrance.525"}
      borderColor={"bluefrance.525"}
      borderLeftWidth={"4px"}
      padding={"16px 28px"}
      mt={"32px"}
    >
      <Flex direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
        <Box>
          <Text fontWeight={"bold"}>Données incomplètes</Text>
          <Text>Certaines données ne sont pas encore disponibles pour les formations de cet établissement</Text>
        </Box>

        <Link
          href={
            "https://aide.orion.inserjeunes.beta.gouv.fr/fr/article/pourquoi-certaines-donnees-sont-indisponibles-dans-orion-puqea5/"
          }
          passHref
          target="_blank"
        >
          <Button color="bluefrance.113">
            Voir pourquoi
            <Icon icon="ri:arrow-right-line" width={"16px"} height={"16px"} style={{ marginLeft: "8px" }} />
          </Button>
        </Link>
      </Flex>
    </GridItem>
  );
};
