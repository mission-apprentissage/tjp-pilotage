import { Box, Button, Flex, GridItem, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

export const DonneesIncompletes = ({
  isMissingDatas,
}: {
  isMissingDatas: boolean;
}) => {
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
      <Flex
        direction={"row"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>
          <Text fontWeight={"bold"}>Données incomplètes</Text>
          <Text>
            Certaines données ne sont pas encore disponibles pour les formations
            de cet établissement
          </Text>
        </Box>

        <Button color="bluefrance.113">
          Voir les données régionales
          <Icon
            icon="ri:external-link-line"
            width={"16px"}
            height={"16px"}
            style={{ marginLeft: "8px" }}
          />
        </Button>
      </Flex>
    </GridItem>
  );
};
