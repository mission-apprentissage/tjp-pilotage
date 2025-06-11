import { Flex,Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionValeurAjoutee = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? "Capacité de l'établissement à insérer, en prenant en compte le profil social des élèves et le taux de chômage de la zone d'emploi, comparativement au taux de référence d’établissements similaires."
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionValeurAjoutee = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionValeurAjoutee label={label}/>}
      onClick={() => openGlossaire("valeur-ajoutee")}
    />
  );
};

export {
  DefinitionValeurAjoutee,
  TooltipDefinitionValeurAjoutee
};
