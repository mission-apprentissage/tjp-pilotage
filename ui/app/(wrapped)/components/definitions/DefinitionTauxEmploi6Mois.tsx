import { Flex,Text} from '@chakra-ui/react';
import {CURRENT_IJ_MILLESIME} from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";
import {formatMillesime} from '@/utils/formatLibelle';

const DefinitionTauxEmploi6Mois = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ??
      `Nombre d’élèves en emploi 6 mois après leur sortie d’études / Nombre de sortants (hors ré-inscrits en formation)
      (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)}).`
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionTauxEmploi6Mois = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxEmploi6Mois label={label}/>}
      onClick={() => openGlossaire("taux-emploi-6-mois")}
    />
  );
};

export {
  DefinitionTauxEmploi6Mois,
  TooltipDefinitionTauxEmploi6Mois
};
