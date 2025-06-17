import { Flex,Text} from '@chakra-ui/react';
import {CURRENT_IJ_MILLESIME} from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";
import {formatMillesime} from '@/utils/formatLibelle';

const DefinitionTauxPoursuiteEtudes = ({ label, millesime }: { label?: string; millesime?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ??
      `Nombre d’élèves ré-inscrits en formation à N+1 / Nombre d’inscrits en dernière année (réorientation et redoublement compris)
      (millésimes ${formatMillesime(millesime ?? CURRENT_IJ_MILLESIME)}).`
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionTauxPoursuiteEtudes = ({ label, millesime }: { label?: string; millesime?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxPoursuiteEtudes label={label} millesime={millesime} />}
      onClick={() => openGlossaire("taux-poursuite-etudes")}
    />
  );
};

export {
  DefinitionTauxPoursuiteEtudes,
  TooltipDefinitionTauxPoursuiteEtudes
};
