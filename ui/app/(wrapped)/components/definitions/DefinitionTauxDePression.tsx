import { Flex,Text} from '@chakra-ui/react';
import { CURRENT_RENTREE } from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxDePression = ({ label, rentreeScolaire }: { label?: string; rentreeScolaire?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>
      { label ??
      `
        Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional (RS ${rentreeScolaire ?? CURRENT_RENTREE}).
      ` }
    </Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
    <TauxPressionScale />
  </Flex>
);

const TooltipDefinitionTauxDePression = ({ label, rentreeScolaire }: { label?: string; rentreeScolaire?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxDePression label={label} rentreeScolaire={rentreeScolaire} />}
      onClick={() => openGlossaire("taux-de-pression")}
    />
  );
};

export {
  DefinitionTauxDePression,
  TooltipDefinitionTauxDePression
};
