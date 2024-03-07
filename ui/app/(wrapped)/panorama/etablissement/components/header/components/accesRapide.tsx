import {
  Flex,
  GridItem,
  HStack,
  Link,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { HTMLAttributeAnchorTarget } from "react";

const ShortLink = ({
  iconLeft,
  iconRight,
  label,
  href,
  target,
}: {
  iconLeft?: string;
  iconRight?: string;
  label: string;
  href: string;
  target?: HTMLAttributeAnchorTarget | undefined;
}) => (
  <Link
    variant={"link"}
    mx={"12px"}
    color={"bluefrance"}
    fontWeight={"bold"}
    href={href}
    target={target}
    display={"flex"}
    flexDirection={"row"}
    alignItems={"center"}
  >
    {iconLeft && (
      <Icon
        icon={iconLeft}
        height={"16px"}
        width={"16px"}
        style={{ marginRight: "8px" }}
      />
    )}
    {label}
    {iconRight && (
      <Icon
        icon={iconRight}
        height={"16px"}
        width={"16px"}
        style={{ marginLeft: "8px" }}
      />
    )}
  </Link>
);

export const AccesRapide = ({ uai }: { uai: string }) => {
  return (
    <GridItem colSpan={12} justifySelf={"start"} my={"32px"}>
      <Flex>
        <Text fontWeight={"bold"} pr={"24px"}>
          ACCÈS RAPIDE
        </Text>
        <HStack
          divider={<StackDivider borderColor={"grey.650"} />}
          color={"bluefrance.113"}
        >
          <ShortLink
            iconLeft={"ri:bar-chart-box-line"}
            label={"Analyse"}
            href="#analyse-detaille"
          />
          <ShortLink
            iconLeft={"ri:link"}
            label={"Liens utiles"}
            href="#liens-utiles"
          />
          <ShortLink
            iconRight={"ri:arrow-right-line"}
            label={"Console de l'établissement"}
            href={`/console/etablissements?filters[uai][0]=${uai}`}
            target="_blank"
          />
        </HStack>
      </Flex>
    </GridItem>
  );
};
