import { Badge, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

export const BadgeActionPrioritaire = ({
  isFormationActionPrioritaire = false,
  withIcon = false,
  labelSize = "short",
  size = "xs",
  textTransform = "uppercase",
}: {
  isFormationActionPrioritaire?: boolean;
  withIcon?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  textTransform?: "uppercase" | "capitalize" | "lowercase";
}) => {
  if (!isFormationActionPrioritaire) return <></>;
  return (
    <Badge gap={1} size={size} my={"auto"} bgColor={"yellowTournesol.950"} color={"yellowTournesol.407"}>
      {withIcon && (
        <Flex my={"auto"}>
          <Icon icon="ri:file-info-fill" />
        </Flex>
      )}
      <Text textTransform={textTransform}>
        {labelSize === "short" ? "Prio" : TypeFormationSpecifiqueEnum["Action prioritaire"]}
      </Text>
    </Badge>
  );
};
