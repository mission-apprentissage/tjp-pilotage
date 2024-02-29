import {
  Flex,
  GridItem,
  HStack,
  Link,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";

const ShortLink = ({
  iconLeft,
  iconRight,
  label,
  href,
}: {
  iconLeft?: string;
  iconRight?: string;
  label: string;
  href: string;
}) => (
  <Link
    variant={"link"}
    mx={"12px"}
    color={"bluefrance"}
    fontWeight={"bold"}
    href={href}
    target="_blank"
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
          {/* TODO : changer le lien href */}
          <ShortLink
            iconLeft={"ri:bar-chart-box-line"}
            label={"Analyse"}
            href="/"
          />
          {/* TODO : changer le lien href */}
          <ShortLink iconLeft={"ri:link"} label={"Liens utiles"} href="/" />
          <ShortLink
            iconRight={"ri:arrow-right-line"}
            label={"Console de l'établissement"}
            href={`/console/etablissements?filters[uai][0]=${uai}`}
          />
        </HStack>
      </Flex>
    </GridItem>
  );
};
