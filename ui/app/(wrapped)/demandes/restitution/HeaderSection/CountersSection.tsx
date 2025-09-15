import { Box, Card, CardBody, CardHeader, Divider, Flex, Heading, Text, VisuallyHidden } from "@chakra-ui/react";
import {Icon} from '@iconify/react';
import type { ReactNode } from "react";

import type { StatsRestitution } from "@/app/(wrapped)/demandes/restitution/types";
import {themeDefinition} from '@/theme/theme';

const CountCard = ({
  label,
  icon,
  subLabel,
  value,
}: {
  label: string;
  icon?: ReactNode;
  subLabel?: string;
  value?: {
    total?: number;
    scolaire?: number;
    apprentissage?: number;
  };
}) => (
  <Card minW={[null, null, "96"]} flex={1} bgColor="white" borderRadius={5}>
    <CardHeader px={3} pt={2} pb={1}>
      <Flex flexDirection="column" minH="42px">
        <Flex>
          <Flex direction={"column"}>
            <Heading as="h2" fontSize="lg" fontWeight="bold" lineHeight={"20px"}>
              <VisuallyHidden>Libellé :</VisuallyHidden>
              {label}
            </Heading>
            <Heading as="h3" fontSize="sm">
              <VisuallyHidden>Sous libellé :</VisuallyHidden>
              {subLabel}
            </Heading>
          </Flex>
          <Box ms={"auto"}>{icon}</Box>
        </Flex>
      </Flex>
    </CardHeader>
    <CardBody pb={3} pt={0} px={3}>
      <Flex flexDirection="column">
        <Flex direction={"row"} justify={"space-between"} py={4}>
          <Heading as="h4" fontSize={36} fontWeight={700} mt={"auto"} lineHeight={"32px"} ms={"auto"}>
            {value?.total ? value?.total : "0"}
          </Heading>
        </Flex>
        <Flex flexDirection="column" justifyContent={"end"}>
          <Flex justify={"space-between"} pb="2" mt={"auto"}>
            <Heading as="h4" justifyContent="end" fontSize={"12"} lineHeight={"4"} fontWeight={400}>
              scolaire
            </Heading>
            <Flex>
              <Box minW={9}>
                <Text textAlign="end" fontSize={12} fontWeight={"bold"}>
                  {value?.scolaire ? value?.scolaire : "0"}
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Divider />
          <Flex justify={"space-between"} pt="2">
            <Heading as="h4" justifyContent="end" fontSize={"12"} lineHeight={"4"} fontWeight={400}>
              apprentissage
            </Heading>
            <Flex>
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

export const CountersSection = ({ countData }: { countData?: StatsRestitution }) => {
  return (
    <Flex flexDirection={"row"} gap={4} overflowY={"auto"} pb={2} flexWrap={["wrap", null, "nowrap"]}>
      <Flex gap={4} width="100%">
        <CountCard
          label="Places ouvertes"
          value={countData?.ouvertures}
          icon={<Icon width="30px" icon="ri:user-add-fill" color={themeDefinition.colors.bluefrance[525]} />}
        />
        <CountCard
          label="Places fermées"
          value={countData?.fermetures}
          icon={<Icon width="30px" icon="ri:user-unfollow-fill" color={themeDefinition.colors.success["425_active"]} />}
        />
        <CountCard
          label="Places colorées"
          value={countData?.ouverturesColorations}
          icon={<Icon width="30px" icon={"ri:account-pin-box-fill"} color={themeDefinition.colors.purpleGlycine["850_active"]} />}
        />
      </Flex>
    </Flex>
  );
};
