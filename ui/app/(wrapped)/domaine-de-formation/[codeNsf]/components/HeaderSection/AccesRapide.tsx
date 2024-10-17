import { ShortLink } from "@/components/ShortLink";
import { HStack, StackDivider } from "@chakra-ui/react";

export const AccesRapide = () => {
  return (
    <HStack
      divider={<StackDivider borderColor={"grey.650"} />}
      color={"bluefrance.113"}
    >
      <ShortLink
        iconLeft={"ri:map-pin-line"}
        label={"Formations"}
        href="#formations"
        ml={"0px"}
      />
      <ShortLink
        iconLeft={"ri:link"}
        label={"Liens utiles"}
        href="#liens-utiles"
      />
      <ShortLink
        iconRight={"ri:arrow-right-line"}
        label={"Ouvrir la console des formations"}
        href={`/console/formations`}
        target="_blank"
      />
    </HStack>
  );
};
