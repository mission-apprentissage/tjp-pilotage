import type { BadgeProps } from "@chakra-ui/react";
import { chakra, Flex, Text, useToken} from "@chakra-ui/react";

import { formatTypeDemandeArray} from "@/utils/formatLibelle";
import { getTypeDemandeBgColor} from "@/utils/getTypeDemandeColor";


export const DateEffetTransformationComponent = chakra(({
  rentreeScolaire,
  dateEffetTransformation,
  typeDemande,
  ...props
}: {
  rentreeScolaire?: string;
  dateEffetTransformation?: string;
  typeDemande?: string;
  props?: BadgeProps;
}) => {
  if(!dateEffetTransformation || !rentreeScolaire || !typeDemande) return null;
  const dateEffetTransformationArray = dateEffetTransformation?.split(", ");
  const typeDemandeArray = formatTypeDemandeArray(typeDemande);
  const colorKeys = typeDemandeArray.map((typeDemande) => getTypeDemandeBgColor(typeDemande?.value));
  const fetchedColors = useToken("colors", colorKeys);
  const highlightedColors: Record<string, string> = {};
  dateEffetTransformationArray.forEach((dateEffetTransformation, index) => {
    highlightedColors[dateEffetTransformation] = fetchedColors[index];
  });

  return (
    <Flex direction={"row"} gap={2} w={"fit-content"} {...props}>
      <svg width="104" height="38" viewBox="0 0 100 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="16" x2="104" y2="16" stroke="#DDDDDD"/>
        <circle cx="16" cy="16" r="8" fill={highlightedColors[parseInt(rentreeScolaire)] ?? "#D9D9D9"}
        />
        <circle cx="40" cy="16" r="8" fill={highlightedColors[parseInt(rentreeScolaire)+1] ?? "#D9D9D9"}/>
        <circle cx="64" cy="16" r="8" fill={highlightedColors[parseInt(rentreeScolaire)+2] ?? "#D9D9D9"}/>
        <circle cx="88" cy="16" r="8" fill={highlightedColors[parseInt(rentreeScolaire)+3] ?? "#D9D9D9"}/>
      </svg>
      <Text my={"auto"}>{dateEffetTransformation}</Text>
    </Flex>
  );
});
