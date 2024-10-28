import { Box, Flex, Popover, PopoverCloseButton, PopoverContent, PopoverTrigger } from "@chakra-ui/react";

import { FormationTooltipContent } from "@/app/(wrapped)/panorama/components/FormationTooltipContent";
import type { PanoramaTopFlop } from "@/app/(wrapped)/panorama/types";
import { formatPercentage } from "@/utils/formatUtils";

export const TopFlopChartItem = ({
  formation,
  value,
  color = "bluefrance.625",
}: {
  formation: PanoramaTopFlop;
  value: number;
  color?: string;
}) => {
  return (
    <Popover>
      <Flex gap="8" align="center">
        <Box flex={1} textAlign="right" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {formation.libelleFormation}
        </Box>
        <Box flex={1}>
          <PopoverTrigger>
            <Flex
              cursor="pointer"
              transition="opacity 250ms"
              _hover={{ opacity: 0.9 }}
              align={"center"}
              bg={color}
              color={"white"}
              px="2"
              pr="1"
              height={"24px"}
              width={`${value * 100}%`}
              fontSize={11}
              whiteSpace="nowrap"
            >
              {formatPercentage(formation.tauxDevenirFavorable)}
            </Flex>
          </PopoverTrigger>
        </Box>
      </Flex>

      <PopoverContent _focusVisible={{ outline: "none" }} p="3" width="280px">
        <PopoverCloseButton />
        <FormationTooltipContent formation={formation} />
      </PopoverContent>
    </Popover>
  );
};
