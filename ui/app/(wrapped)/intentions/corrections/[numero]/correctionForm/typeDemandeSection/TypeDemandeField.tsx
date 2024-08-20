import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Img,
  RadioGroup,
  SimpleGrid,
  Text,
  useToken,
} from "@chakra-ui/react";
import { ComponentProps, ReactNode } from "react";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { TooltipIcon } from "@/components/TooltipIcon";

import {
  shouldDisplayTypeDemande,
  TYPES_DEMANDES_OPTIONS,
} from "../../../../utils/typeDemandeUtils";
import { Campagne, Intention } from "../types";

function RadioCard({
  value,
  title,
  desc,
  selected,
  disabled,
  invalid,
  tooltip,
  ...props
}: {
  value: string;
  title: ReactNode;
  desc: ReactNode;
  selected: boolean;
  disabled: boolean;
  invalid: boolean;
  tooltip: ReactNode;
} & ComponentProps<"div">) {
  const bf113 = useToken("colors", "bluefrance.113");

  return (
    <Box
      display="flex"
      flexDirection="column"
      {...props}
      onClick={!disabled ? props.onClick : undefined}
      flex={1}
      cursor={disabled ? "not-allowed" : "pointer"}
      borderWidth="1px"
      aria-checked={selected}
      _checked={{
        bg: "blueecume.925",
        boxShadow: `0 0 0 2px ${bf113}`,
      }}
      borderColor={invalid ? "red" : "inherit"}
      p={4}
      opacity={disabled ? "0.5" : "1"}
    >
      <Flex mb="3">
        <Img
          me={2}
          display={["none", null, "unset"]}
          height={"20px"}
          src={`/icons/${value}.svg`}
        />
        <Text
          fontWeight="bold"
          fontSize="lg"
          color="bluefrance.113"
          lineHeight={"20px"}
        >
          {title}
        </Text>
        {tooltip}
      </Flex>
      <Text fontSize="12px" mb="auto">
        {desc}
      </Text>
    </Box>
  );
}

export const TypeDemandeField = chakra(
  ({
    demande,
    campagne,
    className,
  }: {
    demande: Intention;
    campagne: Campagne;
    className?: string;
  }) => {
    const { openGlossaire } = useGlossaireContext();
    return (
      <FormControl className={className} isRequired>
        <FormLabel mb="4">Ma correction concerne</FormLabel>
        <RadioGroup
          as={SimpleGrid}
          columns={[2, null, 3]}
          spacing={4}
          name={"typeDemande"}
        >
          {Object.values(TYPES_DEMANDES_OPTIONS).map(
            (item) =>
              shouldDisplayTypeDemande(
                item.value,
                campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE
              ) && (
                <RadioCard
                  selected={item.value === demande?.typeDemande}
                  key={item.value}
                  value={item.value}
                  title={item.label}
                  desc={item.desc}
                  disabled={true}
                  invalid={false}
                  tooltip={
                    isTypeColoration(item.value) && (
                      <TooltipIcon
                        mt={"1"}
                        ml={2}
                        onClick={(e) => {
                          e.preventDefault();
                          openGlossaire("coloration");
                        }}
                        color={"bluefrance.113"}
                      />
                    )
                  }
                />
              )
          )}
        </RadioGroup>
      </FormControl>
    );
  }
);
