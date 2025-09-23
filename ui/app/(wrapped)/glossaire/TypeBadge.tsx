import { Badge } from "@chakra-ui/react";

export const TypeBadge = ({ type }: { type: string }) => {
  switch (type.toLowerCase()){
  case "formation":
    return <Badge variant="error" mr="12px">Formation</Badge>;
  case "acteurs":
    return <Badge variant="purpleGlycine"  mr="12px">Acteurs</Badge>;
  case "effectifs":
    return <Badge variant="info" mr="12px">Effectifs</Badge>;
  case "emploi":
    return <Badge variant="success" mr="12px">Emploi</Badge>;
  case "inserjeunes":
    return <Badge variant="brownCafeCreme" mr="12px">Inserjeunes</Badge>;
  }
};
