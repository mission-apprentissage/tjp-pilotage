import type { LinkProps } from "@chakra-ui/react";
import { forwardRef, GridItem, HStack, Link, StackDivider } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

type ShtLinkProps = LinkProps & {
  label: string;
  iconLeft?: string;
  iconRight?: string;
};

const ShortLink = forwardRef<ShtLinkProps, "a">(({ label, href, iconLeft, iconRight, target, ...rest }, ref) => (
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
    ref={ref}
    {...rest}
  >
    {iconLeft && <Icon icon={iconLeft} height={"16px"} width={"16px"} style={{ marginRight: "8px" }} />}
    {label}
    {iconRight && <Icon icon={iconRight} height={"16px"} width={"16px"} style={{ marginLeft: "8px" }} />}
  </Link>
));

export const AccesRapideSection = ({ uai }: { uai: string }) => {
  return (
    <GridItem colSpan={12} justifySelf={"start"} my={"16px"}>
      <HStack divider={<StackDivider borderColor={"grey.650"} />} color={"bluefrance.113"}>
        <ShortLink iconLeft={"ri:bar-chart-box-line"} label={"Analyse"} href="#analyse-detaille" ml={"0px"} />
        <ShortLink iconLeft={"ri:map-pin-line"} label={"Carte"} href="#carte" />
        <ShortLink iconLeft={"ri:link"} label={"Liens utiles"} href="#liens-utiles" />
        <ShortLink
          iconRight={"ri:arrow-right-line"}
          label={"Console de l'établissement"}
          href={`/console/etablissements?filters[uai][0]=${uai}`}
          target="_blank"
        />
      </HStack>
    </GridItem>
  );
};
