import type { BoxProps } from "@chakra-ui/react";
import { Badge, Box, Divider, Flex, forwardRef, List, ListItem, Text, Tooltip } from "@chakra-ui/react";
import _ from "lodash";
import { CURRENT_RENTREE } from "shared";

import type { FormationListItem } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { formatAnneeCommuneLibelle } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";
import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";
import { themeColors } from "@/theme/themeColors";

const LabelNumberOfFormations = ({ formations }: { formations?: Array<FormationListItem> }) => (
  <Text>
    <strong>{formations?.length ?? 0}</strong> Formation
    {(formations?.length ?? 0) > 1 ? "s" : ""}
  </Text>
);

const getBackgroundColor = (formation: FormationListItem, selectedCfd: string) => {
  if (formation.cfd === selectedCfd) {
    return "bluefrance.925";
  }

  if (formation.nbEtab === 0) {
    return "grey.925";
  }

  return undefined;
};

const getFontColor = (formation: FormationListItem, selectedCfd: string) => {
  if (formation.cfd === selectedCfd) {
    return "bluefrance.113";
  }

  if (formation.nbEtab === 0) {
    return "grey.625";
  }

  return undefined;
};

type ListeFormationsProps = BoxProps & {
  formations: FormationListItem[];
  selectCfd: (cfd: string) => void;
  selectedCfd: string;
};

export const ListeFormations = forwardRef<ListeFormationsProps, "div">(
  ({ formations, selectCfd, selectedCfd, ...rest }, ref) => {
    const formattedFormations = _.chain(formations)
      .orderBy("ordreFormation", "desc")
      .groupBy("libelleNiveauDiplome")
      .value();

    return (
      <Box
        borderRightWidth={1}
        borderRightColor={"grey.925"}
        overflowY={"auto"}
        h={"80rem"}
        w={"40%"}
        ref={ref}
        {...rest}
      >
        <Flex flex={1} flexDirection={"row"} justifyContent={"space-between"} mx={"8px"} my={"16px"}>
          <LabelNumberOfFormations formations={formations} />
          <Badge variant="info">Rentrée {CURRENT_RENTREE}</Badge>
        </Flex>
        <Divider />
        <List>
          {Object.keys(formattedFormations)
            .sort((a, z) => a.localeCompare(z))
            .map((codeNiveauDiplome) => (
              <ListItem key={codeNiveauDiplome} ms={3}>
                <Text
                  fontWeight={"bold"}
                  my={"3"}
                >{`${codeNiveauDiplome} (${formattedFormations[codeNiveauDiplome].length})`}</Text>
                <List>
                  {formattedFormations[codeNiveauDiplome]
                    .sort((a, z) => a.libelleFormation.localeCompare(z.libelleFormation))
                    .map((formation) => (
                      <ListItem
                        key={`${formation.cfd}`}
                        ms={3}
                        p={"8px 16px 8px 8px"}
                        cursor={"pointer"}
                        onClick={() => {
                          selectCfd(formation.cfd);
                        }}
                        bgColor={getBackgroundColor(formation, selectedCfd)}
                        _hover={{
                          backgroundColor: selectedCfd === formation.cfd ? "bluefrance.925_hover" : "grey.1000_active",
                        }}
                        fontWeight={selectedCfd === formation.cfd ? "bold" : ""}
                        position={"relative"}
                      >
                        <Flex
                          direction="row"
                          justify={"space-between"}
                          _before={{
                            content: "''",
                            width: "0",
                            height: "60%",
                            left: "0",
                            borderLeft: selectedCfd === formation.cfd ? `3px solid ${themeColors.bluefrance[113]}` : "",
                            top: "50%",
                            transform: "translateY(-50%)",
                            position: "absolute",
                          }}
                          paddingLeft={"2px"}
                        >
                          <Tooltip label={formatAnneeCommuneLibelle(formation.libelleFormation)}>
                            <Text
                              my={2}
                              color={getFontColor(formation, selectedCfd)}
                              whiteSpace="normal"
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              isTruncated={true}
                              _firstLetter={{ textTransform: "uppercase" }}
                            >
                              {formatAnneeCommuneLibelle(formation.libelleFormation)}
                            </Text>
                          </Tooltip>
                          <Flex direction="row" gap={1}>
                            <BadgeTypeFamille typeFamille={formation.typeFamille as TypeFamilleKeys} />
                          </Flex>
                        </Flex>
                      </ListItem>
                    ))}
                </List>
              </ListItem>
            ))}
        </List>
      </Box>
    );
  }
);
