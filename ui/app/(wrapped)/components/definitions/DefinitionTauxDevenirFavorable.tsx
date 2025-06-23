import { Flex,Text} from '@chakra-ui/react';
import { CURRENT_IJ_MILLESIME } from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";
import {formatMillesime} from '@/utils/formatLibelle';

const DefinitionTauxDevenirFavorable = ({ label, millesime }: { label?: string; millesime?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ??
      `(Nombre d’élèves en emploi + ré-inscrits en formation) / Nombre d’élèves inscrits à la rentrée précédente
      (millésimes ${formatMillesime(millesime ?? CURRENT_IJ_MILLESIME)}).`
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionTauxDevenirFavorable = ({ label, millesime }: { label?: string; millesime?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionTauxDevenirFavorable label={label} millesime={millesime}/>}
      onClick={() => openGlossaire("taux-de-devenir-favorable")}
    />
  );
};

export {
  DefinitionTauxDevenirFavorable,
  TooltipDefinitionTauxDevenirFavorable
};
