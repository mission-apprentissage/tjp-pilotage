import { ShortLink } from "@/components/ShortLink";
import { GridItem, HStack, StackDivider } from "@chakra-ui/react";

export const AccesRapideSection = ({ uai }: { uai: string }) => {
  return (
    <GridItem colSpan={12} justifySelf={"start"} my={"16px"}>
      <HStack
        divider={<StackDivider borderColor={"grey.650"} />}
        color={"bluefrance.113"}
      >
        <ShortLink
          iconLeft={"ri:bar-chart-box-line"}
          label={"Analyse"}
          href="#analyse-detaille"
          ml={"0px"}
        />
        <ShortLink iconLeft={"ri:map-pin-line"} label={"Carte"} href="#carte" />
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
    </GridItem>
  );
};
