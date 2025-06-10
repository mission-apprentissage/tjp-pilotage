import { Flex,Text} from '@chakra-ui/react';
import { CURRENT_IJ_MILLESIME } from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { formatMillesime } from '@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData';
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxDevenirFavorable = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ??
      `(Nombre d’élèves en emploi + ré-inscrits en formation) / Nombre d’élèves inscrits à la rentrée précédente
      (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)}).`
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionTauxDevenirFavorable = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionTauxDevenirFavorable label={label} />}
      onClick={() => openGlossaire("taux-de-devenir-favorable")}
    />
  );
};

export {
  DefinitionTauxDevenirFavorable,
  TooltipDefinitionTauxDevenirFavorable
};
