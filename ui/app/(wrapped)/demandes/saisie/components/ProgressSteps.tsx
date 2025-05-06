import { Flex, HStack, Text } from "@chakra-ui/react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getStepWorkflow } from "@/app/(wrapped)/demandes/utils/statutUtils";

export const ProgressSteps = ({ statut }: { readonly statut: DemandeStatutType }) => {
  return (
    <HStack w={"200px"} gap={0} bgColor={"info.950"} borderRadius={"0.25rem"} height={"21px"}>
      {getStepWorkflow(statut) === 1 && (
        <Flex width={"100%"} justify={"center"} height={"100%"}>
          <Flex
            h={"100%"}
            bgColor={statut === DemandeStatutEnum["dossier incomplet"] ? "orangeTerreBattue.850" : "bluefrance.525"}
            justify={"center"}
            p={"0.25rem 0.5rem"}
            grow={0}
            borderLeftRadius={"0.25rem"}
            color={statut === DemandeStatutEnum["dossier incomplet"] ? "warning.425" : "white"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"}>Phase 1</Text>
          </Flex>
          <Flex h={"100%"} grow={2} />
        </Flex>
      )}
      {getStepWorkflow(statut) === 2 && (
        <Flex width={"100%"} justify={"center"} height={"100%"}>
          <Flex h={"100%"} bgColor={"blueecume.850"} grow={1} borderLeftRadius={"0.25rem"} />
          <Flex h={"100%"} bgColor={"bluefrance.525"} justify={"center"} p={"0.25rem 0.5rem"} alignItems={"center"}>
            <Text fontWeight={"bold"} color="white">
              Phase 2
            </Text>
          </Flex>
          <Flex h={"100%"} grow={1} />
        </Flex>
      )}
      {getStepWorkflow(statut) === 3 && (
        <Flex width={"100%"} justify={"center"} height={"100%"}>
          <Flex h={"100%"} bgColor={"blueecume.850"} grow={2} borderLeftRadius={"0.25rem"} />
          <Flex
            h={"100%"}
            bgColor={"bluefrance.525"}
            justify={"center"}
            p={"0.25rem 0.5rem"}
            grow={0}
            borderRightRadius={"0.25rem"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"} color="white">
              Phase 3
            </Text>
          </Flex>
        </Flex>
      )}
      {getStepWorkflow(statut) === 4 && (
        <Flex
          w={"100%"}
          h={"100%"}
          bgColor={"bluefrance.525"}
          borderRadius={"0.25rem"}
          justify={"center"}
          p={"0.25rem 0.5rem"}
          alignItems={"center"}
        >
          <Text fontWeight={"bold"} color="white">
            Terminé
          </Text>
        </Flex>
      )}
    </HStack>
  );
};
