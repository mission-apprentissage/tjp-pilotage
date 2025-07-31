import { Flex,Text} from '@chakra-ui/react';
import { CURRENT_RENTREE } from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxDeDemande = ({ label, rentreeScolaire }: { label?: string; rentreeScolaire?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>
      { label ??
      `
        Le ratio entre le nombre de voeux et la capacité de la formation au niveau régional (RS ${rentreeScolaire ?? CURRENT_RENTREE}), BTS uniquement.
      ` }
    </Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);

const TooltipDefinitionTauxDeDemande = ({ label, rentreeScolaire }: { label?: string; rentreeScolaire?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxDeDemande label={label} rentreeScolaire={rentreeScolaire} />}
      onClick={() => openGlossaire("taux-de-demande")}
    />
  );
};

export {
  DefinitionTauxDeDemande,
  TooltipDefinitionTauxDeDemande
};
