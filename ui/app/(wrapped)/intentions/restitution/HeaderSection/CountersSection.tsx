import { Box, Card, CardBody, CardHeader, Divider, Flex, Img, Text } from "@chakra-ui/react";

import type { StatsRestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";

const CountCard = ({
  label,
  iconSrc,
  subLabel,
  value,
}: {
  label: string;
  iconSrc?: string;
  subLabel?: string;
  value?: {
    total?: number;
    colorationTotal?: number;
    scolaire?: number;
    colorationScolaire?: number;
    apprentissage?: number;
    colorationApprentissage?: number;
  };
}) => (
  <Card minW={[null, null, "56"]} flex={1} bgColor="white" borderRadius={5}>
    <CardHeader px={3} pt={2} pb={1}>
      <Flex flexDirection="column" minH="42px">
        <Flex>
          <Flex direction={"column"}>
            <Text fontSize="lg" fontWeight="bold" lineHeight={"20px"}>
              {label}
            </Text>
            <Text fontSize="sm">{subLabel}</Text>
            {value?.colorationTotal !== undefined && (
              <Text fontSize="12" lineHeight={"20px"} fontWeight={400} color="grey.425">
                (dont coloration)
              </Text>
            )}
          </Flex>
          {iconSrc && <Img src={`/icons/${iconSrc}.svg`} height="30px" ms={"auto"} />}
        </Flex>
      </Flex>
    </CardHeader>
    <CardBody pb={3} pt={0} px={3}>
      <Flex flexDirection="column">
        <Flex direction={"row"} justify={"space-between"} py={4}>
          {value?.colorationTotal !== undefined && (
            <Text mt={"auto"} fontSize={18} lineHeight={"20px"} fontWeight={400} color="grey.425">
              ({value?.colorationTotal})
            </Text>
          )}
          <Text fontSize={36} fontWeight={700} mt={"auto"} lineHeight={"32px"} ms={"auto"}>
            {value?.total ? value?.total : "0"}
          </Text>
        </Flex>
        <Flex flexDirection="column" justifyContent={"end"}>
          <Flex justify={"space-between"} pb="2" mt={"auto"}>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              scolaire
            </Text>
            <Flex>
              {value?.colorationScolaire !== undefined && (
                <Text fontSize={12} fontWeight={400} color="grey.425" me={3}>
                  ({value?.colorationScolaire})
                </Text>
              )}
              <Box minW={9}>
                <Text textAlign="end" fontSize={12} fontWeight={"bold"}>
                  {value?.scolaire ? value?.scolaire : "0"}
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Divider />
          <Flex justify={"space-between"} pt="2">
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              apprentissage
            </Text>
            <Flex>
              {value?.colorationApprentissage !== undefined && (
                <Text fontSize={12} fontWeight={400} color="grey.425" me={3}>
                  ({value?.colorationApprentissage})
                </Text>
              )}
              <Box minW={9}>
                <Text textAlign="end" fontSize={12} fontWeight={"bold"}>
                  {value?.apprentissage ? value?.apprentissage : "0"}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </CardBody>
  </Card>
);

export const CountersSection = ({ countData }: { countData?: StatsRestitutionIntentions }) => {
  return (
    <Flex flexDirection={"row"} gap={4} overflowY={"auto"} pb={2} flexWrap={["wrap", null, "nowrap"]}>
      <Flex gap={4} width="100%">
        <CountCard label="Places ouvertes" iconSrc={"places_ouvertes"} value={countData?.ouvertures} />
        <CountCard label="Places fermées" iconSrc={"places_fermees"} value={countData?.fermetures} />
      </Flex>
      <Flex gap={4} width="100%">
        <CountCard
          label="Cert. Spécialisat."
          iconSrc={"places_ami-cma"}
          subLabel="Places ouvertes"
          value={countData?.certifSpecialisation}
        />
        <CountCard label="FCIL" iconSrc={"places_fcil"} subLabel="Places ouvertes" value={countData?.FCILs} />
      </Flex>
    </Flex>
  );
};
