import { Flex,Text} from '@chakra-ui/react';
import {CURRENT_IJ_MILLESIME} from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import {formatMillesime} from '@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData';
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxPoursuiteEtudes = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ??
      `Nombre d’élèves ré-inscrits en formation à N+1 / Nombre d’inscrits en dernière année (réorientation et redoublement compris)
      (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)}).`
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionTauxPoursuiteEtudes = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxPoursuiteEtudes label={label} />}
      onClick={() => openGlossaire("taux-poursuite-etudes")}
    />
  );
};

export {
  DefinitionTauxPoursuiteEtudes,
  TooltipDefinitionTauxPoursuiteEtudes
};
