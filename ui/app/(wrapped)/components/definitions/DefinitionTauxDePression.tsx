import { Flex,Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxDePression = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>
      { label ?? "Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional." }
    </Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
    <TauxPressionScale />
  </Flex>
);

const TooltipDefinitionTauxDePression = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxDePression label={label} />}
      onClick={() => openGlossaire("taux-de-pression")}
    />
  );
};

export {
  DefinitionTauxDePression,
  TooltipDefinitionTauxDePression
};
