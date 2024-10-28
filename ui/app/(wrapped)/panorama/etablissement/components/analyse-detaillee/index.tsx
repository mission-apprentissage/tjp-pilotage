import { Center, Divider, Flex, Text } from "@chakra-ui/react";

import { Loading } from "@/components/Loading";
import { feature } from "@/utils/feature";

import { useAnalyseDetaillee } from "./hook";
import { TabsContent } from "./tabs/TabsContent";
import { TabsSection } from "./tabs/TabsSection";

const NoFormationFound = ({ libelleEtablissement, uai }: { uai: string; libelleEtablissement?: string }) => (
  <Center my={16}>
    <Text fontSize={25}>{`Aucune formation trouvée pour l'établissement ${libelleEtablissement ?? ""} (${uai})`}</Text>
  </Center>
);

const EtablissementAnalyseDetaillee = () => {
  const hook = useAnalyseDetaillee();
  const { etablissement, isLoading, displayDashboard, displayQuadrant, displayType, uai, formationFounds } = hook;

  if (isLoading) {
    return <Loading my={16} size="xl" />;
  }

  return (
    <Flex direction={"column"} id={"analyse-detaille"}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700} mt={"32px"}>
        Analyse des formations
      </Text>
      <Divider width="48px" mb={feature.etablissementQuadrant ? "32px" : undefined} mt={"24px"} />
      {feature.etablissementQuadrant && (
        <TabsSection displayDashboard={displayDashboard} displayQuadrant={displayQuadrant} displayType={displayType} />
      )}
      {formationFounds ? (
        <TabsContent {...hook} />
      ) : (
        <NoFormationFound uai={uai} libelleEtablissement={etablissement?.libelleEtablissement} />
      )}
      <Divider mb={"32px"} mt={"24px"} />
    </Flex>
  );
};

export { EtablissementAnalyseDetaillee };
