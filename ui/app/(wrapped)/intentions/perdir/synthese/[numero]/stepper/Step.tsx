import { Box, chakra, Flex, Tag, Text, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

const StepIcon = chakra(
  ({ etape, currentEtape, incomplet }: { etape: number; currentEtape: number; incomplet?: boolean }) => {
    const bluefrance113 = useToken("colors", "bluefrance.113");
    const success425 = useToken("colors", "success.425");

    if (incomplet) {
      return (
        <Box w="32px" h="28px" borderRadius={"100%"} bgColor={"orangeTerreBattue.850"}>
          <Icon icon={"ri:close-line"} color={bluefrance113} width="100%" />
        </Box>
      );
    }
    if (etape === currentEtape) {
      return (
        <Box w="32px" h="28px" borderRadius={"100%"} bgColor={"blueecume.925"}>
          <Text textAlign={"center"} fontSize={"18px"} fontWeight={700} color={"bluefrance.113"}>
            {etape}
          </Text>
        </Box>
      );
    }
    if (currentEtape > etape) {
      return (
        <Box w="32px" h="28px" borderRadius={"100%"} bgColor={"success.950"}>
          <Icon icon={"ri:check-line"} color={success425} width="100%" />
        </Box>
      );
    }
    return (
      <Box w="32px" h="28px" borderRadius={"100%"} bgColor={"grey.925"}>
        <Text textAlign={"center"} fontSize={"18px"} fontWeight={700} color={"grey.625"}>
          {etape}
        </Text>
      </Box>
    );
  }
);

export const Step = ({
  etape,
  currentEtape,
  titre,
  dateDebut,
  dateFin,
  description,
  incomplet = false,
}: {
  etape: number;
  currentEtape: number;
  titre: string;
  dateDebut?: string;
  dateFin?: string;
  description: string;
  incomplet?: boolean;
}) => {
  return (
    <Flex direction={"column"} gap={2}>
      <Flex direction={"row"} w={"100%"} gap={3} mb={3}>
        <StepIcon etape={etape} currentEtape={currentEtape} incomplet={incomplet} />
        <Box w="100%" h="2px" bgColor={currentEtape > etape ? "bluefrance.113" : "grey.625"} my={"auto"} />
      </Flex>
      <Flex direction={"row"} gap={2}>
        <Text fontSize="lg" fontWeight="bold" color={currentEtape >= etape ? "black" : "grey.625"}>
          {titre}
        </Text>
        {currentEtape === etape && (
          <Tag size={"md"} me={2} bgColor={"info.950"} color={"info.text"}>
            En cours
          </Tag>
        )}
      </Flex>
      <Flex direction={"row"}>
        {currentEtape === etape && (
          <>{dateDebut && <Text color={currentEtape >= etape ? "black" : "grey.625"}>depuis le {dateDebut}</Text>}</>
        )}
        {currentEtape > etape && (
          <>
            {dateDebut && dateFin && (
              <Text color={currentEtape >= etape ? "black" : "grey.625"}>
                du {dateDebut} au {dateFin}
              </Text>
            )}
          </>
        )}
      </Flex>
      <Text fontSize={"12px"} fontWeight={400} color={"grey.625"}>
        {description}
      </Text>
    </Flex>
  );
};
