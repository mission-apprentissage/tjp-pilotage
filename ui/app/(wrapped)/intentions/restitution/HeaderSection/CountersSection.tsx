import { Card, CardBody, CardHeader, Divider, Flex, Img, Text, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import type { StatsRestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";

const CountCard = ({
  label,
  icon,
  iconSrc,
  subLabel,
  value,
}: {
  label: string;
  icon?: React.ReactNode;
  iconSrc?: string;
  subLabel?: string;
  value?: {
    total?: number;
    scolaire?: number;
    apprentissage?: number;
    coloration?: number;
  };
}) => (
  <Card minW={[null, null, "52"]} flex={1} bgColor="white" borderRadius={5}>
    <CardHeader px={3} pt={2} pb={1}>
      <Flex flexDirection="column" minH="42px">
        <Flex>
          {iconSrc && <Img src={`/icons/${iconSrc}.svg`} height="20px" me={2}></Img>}
          {icon}
          <Text fontSize="lg" fontWeight="bold" lineHeight={"20px"}>
            {label}
          </Text>
        </Flex>
        <Text fontSize="sm">{subLabel}</Text>
      </Flex>
    </CardHeader>
    <CardBody pb={3} pt={0} px={3}>
      <Flex flexDirection="column">
        <Flex pb={4}>
          <Text fontSize="36" fontWeight={"extrabold"}>
            {value?.total ? value?.total : "0"}
          </Text>
        </Flex>
        <Flex flexDirection="column" justifyContent={"end"}>
          <Flex justify={"space-between"} pb="2" mt={"auto"}>
            <Text justifyContent="start" fontSize="12" fontWeight="bold" lineHeight={"4"}>
              {`${value?.scolaire ? value?.scolaire : 0} `}
            </Text>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              scolaire
            </Text>
          </Flex>
          <Divider />
          <Flex justify={"space-between"} pt="2">
            <Text justifyContent="start" fontSize="12" fontWeight="bold" lineHeight={"4"}>
              {`${value?.apprentissage ? value?.apprentissage : 0} `}
            </Text>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              apprentissage
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </CardBody>
  </Card>
);

export const CountersSection = ({ countData }: { countData?: StatsRestitutionIntentions }) => {
  const colorationColor = useToken("colors", "purpleGlycine.850_active");

  return (
    <Flex flexDirection={"row"} gap={4} overflowY={"auto"} pb={2} flexWrap={["wrap", null, "nowrap"]}>
      <Flex gap={4} width="100%">
        <CountCard label="Places ouvertes" value={countData?.ouvertures} iconSrc={"places_ouvertes"} />
        <CountCard label="Places fermées" iconSrc={"places_fermees"} value={countData?.fermetures} />
        <CountCard
          label="Colorations"
          subLabel="Pl. ouvertes + existantes"
          icon={
            <Icon
              icon="ri:account-pin-box-fill"
              height="22px"
              color={colorationColor}
              style={{ marginRight: "0.5rem" }}
            />
          }
          value={countData?.coloration}
        />
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
