import { Flex, Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionColoration = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? "Dans Orion, à partir de la campagne 2024, on désigne comme «Colorations» les places ouvertes colorées soit la différence (si elle est positive) entre le nombre de places colorées actuelles et le nombre de futurs places colorées d'une demande de transformation sur Orion." }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionColoration = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionColoration label={label} />}
      onClick={() => openGlossaire("coloration")}
    />
  );
};

export {
  DefinitionColoration,
  TooltipDefinitionColoration
};
