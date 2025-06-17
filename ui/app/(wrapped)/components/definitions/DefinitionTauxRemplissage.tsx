import { Flex,Text} from '@chakra-ui/react';
import { CURRENT_RENTREE } from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxRemplissage = ({ label, rentreeScolaire }: { label?: string; rentreeScolaire?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? `Pour une formation, le ratio entre l’effectif en entrée et la capacité théorique (RS ${rentreeScolaire ?? CURRENT_RENTREE}).` }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionTauxRemplissage = ({ label, rentreeScolaire }: { label?: string; rentreeScolaire?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionTauxRemplissage label={label} rentreeScolaire={rentreeScolaire} />}
      onClick={() => openGlossaire("taux-de-remplissage")}
    />
  );
};

export {
  DefinitionTauxRemplissage,
  TooltipDefinitionTauxRemplissage
};
