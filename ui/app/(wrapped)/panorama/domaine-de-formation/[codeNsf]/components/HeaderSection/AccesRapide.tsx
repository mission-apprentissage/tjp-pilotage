import { HStack, StackDivider } from "@chakra-ui/react";

import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import { useNsfContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/nsfContext";
import { ShortLink } from "@/components/ShortLink";

export const AccesRapide = () => {
  const { codeNsf } = useNsfContext();
  const { currentFilters } = useFormationContext();

  return (
    <HStack divider={<StackDivider borderColor={"grey.650"} />} color={"bluefrance.113"}>
      <ShortLink iconLeft={"ri:map-pin-line"} label={"Formations"} href="#formations" ml={"0px"} />
      <ShortLink iconLeft={"ri:link"} label={"Liens utiles"} href="#liens-utiles" />
      <ShortLink
        iconRight={"ri:arrow-right-line"}
        label={"Ouvrir la console des formations"}
        href={`/console/formations?filters[codeNsf][0]=${codeNsf}${
          currentFilters.codeRegion ? `&filters[codeRegion][0]=${currentFilters.codeRegion}` : ""
        }&withAnneeCommune=true`}
        target="_blank"
      />
    </HStack>
  );
};
