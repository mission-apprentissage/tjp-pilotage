import { chakra, Flex, FormControl, FormLabel, Radio, RadioGroup, VStack } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";
import { TooltipIcon } from "@/components/TooltipIcon";

export enum TendanceEnum {
  tout = "all",
  hausse = "hausse",
  baisse = "baisse",
}

export const TendanceRadio = chakra(
  ({
    label,
    glossaire,
    tendance,
    setTendance,
  }: {
    label: string;
    glossaire?: GlossaireEntryKey;
    tendance: TendanceEnum;
    setTendance: (value: TendanceEnum) => void;
  }) => {
    const { openGlossaire } = useGlossaireContext();
    return (
      <Flex w={"100%"}>
        <FormControl>
          <FormLabel as="legend" display={"flex"} alignItems={"center"}>
            {label}
            {glossaire && <TooltipIcon onClick={() => openGlossaire(glossaire)} ml={1} />}
          </FormLabel>
          <RadioGroup defaultValue={TendanceEnum.tout} onChange={setTendance} value={tendance}>
            <VStack spacing="12px" alignItems={"flex-start"}>
              <Radio value={TendanceEnum.tout}>Tout</Radio>
              <Radio value={TendanceEnum.hausse}>Hausse</Radio>
              <Radio value={TendanceEnum.baisse}>Baisse</Radio>
            </VStack>
          </RadioGroup>
        </FormControl>
      </Flex>
    );
  }
);
