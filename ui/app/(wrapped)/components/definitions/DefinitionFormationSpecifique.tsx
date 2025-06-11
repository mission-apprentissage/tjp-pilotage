import { Flex,Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionFormationSpecifique = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{label ?? "Désigne dans Orion des formations ayant été identifiées pour certaines de leur particularités." }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionFormationSpecifique = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionFormationSpecifique label={label}/>}
      onClick={() => openGlossaire("formation-specifique")}
    />
  );
};

export {
  DefinitionFormationSpecifique,
  TooltipDefinitionFormationSpecifique
};
