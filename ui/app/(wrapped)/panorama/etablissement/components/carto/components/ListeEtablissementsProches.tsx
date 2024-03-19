import { List, ListItem } from "@chakra-ui/react";

import { client } from "../../../../../../../api.client";

interface ListeEtablissementsProchesProps {
  etablissementsProches: (typeof client.infer)["[GET]/etablissement/:uai/map"]["etablissementsProches"];
}

export const ListeEtablissementsProches = ({
  etablissementsProches,
}: ListeEtablissementsProchesProps) => {
  return (
    <List overflow="auto">
      {etablissementsProches.map((e) => (
        <ListItem key={e.uai}>{e.uai}</ListItem>
      ))}
    </List>
  );
};
