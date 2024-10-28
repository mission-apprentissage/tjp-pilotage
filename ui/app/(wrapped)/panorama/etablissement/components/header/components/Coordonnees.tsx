import { Badge, Box, Flex, GridItem, Image, Text, useToken } from "@chakra-ui/react";

import type { Informations } from "@/app/(wrapped)/panorama/etablissement/components/header/types";

export const Coordonnees = ({ informations }: { informations: Informations }) => {
  const {
    secteur,
    adresse,
    codePostal,
    commune,
    libelleDepartement,
    codeDepartement,
    isApprentissage,
    isScolaire,
    uai,
  } = informations || {};
  const [textDisabled] = useToken("colors", ["grey.625"]);
  return (
    <GridItem colSpan={7}>
      <Text fontSize={{ base: "14px" }} pb={"16px"} fontWeight={"bold"}>
        {secteur === "PU" && "ÉTABLISSEMENT PUBLIC"}
        {secteur === "PR" && "ÉTABLISSEMENT PRIVÉ"}
      </Text>
      <Flex>
        <Image src={`/logo_etablissement.png`} height={"80px"} width={"80px"} alt="logo etablissement" mr={"16px"} />
        <Flex direction={"column"}>
          {adresse && <Text color={textDisabled}>{adresse}</Text>}
          <Text color={textDisabled}>
            {codePostal} {commune} - {libelleDepartement} ({codeDepartement})
          </Text>
          {uai && <Text color={textDisabled}>UAI : {uai}</Text>}
          <Box>
            {isScolaire && (
              <Badge variant="info" mr={"8px"}>
                VOIE SCOLAIRE
              </Badge>
            )}
            {isApprentissage && <Badge variant="new">APPRENTISSAGE</Badge>}
          </Box>
        </Flex>
      </Flex>
    </GridItem>
  );
};
