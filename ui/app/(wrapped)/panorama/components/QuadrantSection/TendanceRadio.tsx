import { chakra, Flex, FormControl, FormLabel, Radio, RadioGroup, VStack } from "@chakra-ui/react";


export enum TendanceEnum {
  tout = "all",
  hausse = "hausse",
  baisse = "baisse",
}

export const TendanceRadio = chakra(
  ({
    label,
    icon,
    tendance,
    setTendance,
  }: {
    label: string;
    icon?: React.ReactNode;
    tendance: TendanceEnum;
    setTendance: (value: TendanceEnum) => void;
  }) => {
    return (
      <Flex w={"100%"}>
        <FormControl>
          <FormLabel as="legend" display={"flex"} alignItems={"center"}>
            {label}
            {icon}
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
