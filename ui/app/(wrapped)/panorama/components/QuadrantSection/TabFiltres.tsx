import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { TooltipIcon } from "../../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../../glossaire/glossaireContext";
import { TendanceEnum, TendanceRadio } from "./TendanceRadio";

export type Filters = {
  effectifMin: number;
  effectif: TendanceEnum;
  tauxPression: TendanceEnum;
  tauxEmploi6Mois: TendanceEnum;
  tauxPoursuiteEtude: TendanceEnum;
};

export const TabFiltres = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TabPanel>
      <Box p={"24px"}>
        <Flex justifyContent={"flex-end"}>
          <Button
            leftIcon={<Icon icon="ri:refresh-line" />}
            variant="ghost"
            color="bluefrance.113"
          >
            Réinitialiser les filtres
          </Button>
        </Flex>
        <FormControl>
          <FormLabel>
            Effectif minimum (en entrée){" "}
            <TooltipIcon
              onClick={() => openGlossaire("effectif-en-entree")}
              label={
                <Box>
                  <Text>
                    Effectifs en entrée en première année de formation.
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
            />
          </FormLabel>
          <Slider
            mt="6"
            onChange={(value) => setFilters({ ...filters, effectifMin: value })}
            min={0}
            max={500}
            value={filters.effectifMin}
            step={5}
          >
            <SliderMark value={0} mt={-8} fontSize={"small"}>
              0
            </SliderMark>
            <SliderMark value={500} mt={-8} fontSize={"small"} ml="-30px">
              500
            </SliderMark>
            <SliderMark
              value={filters.effectifMin}
              textAlign="center"
              mt="4"
              ml="-5"
              w="12"
              fontSize="sm"
            >
              {filters.effectifMin}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>
      </Box>

      <SimpleGrid
        columns={[1, null, 2]}
        spacing={"24px"}
        pt={"32px"}
        p={"24px"}
      >
        <TendanceRadio
          label={"Effectif"}
          tendance={filters.effectif}
          setTendance={(effectif) => setFilters({ ...filters, effectif })}
          glossaire={"effectif-en-entree"}
        />
        <TendanceRadio
          label={"Taux de pression"}
          glossaire={"taux-de-pression"}
          tendance={filters.tauxPression}
          setTendance={(tauxPression) =>
            setFilters({ ...filters, tauxPression })
          }
        />
        <TendanceRadio
          label={"Taux d'emploi 6 mois"}
          glossaire={"taux-emploi-6-mois"}
          tendance={filters.tauxEmploi6Mois}
          setTendance={(tauxEmploi6Mois) =>
            setFilters({ ...filters, tauxEmploi6Mois })
          }
        />
        <TendanceRadio
          label={"Taux de poursuite d'études"}
          glossaire={"taux-poursuite-etudes"}
          tendance={filters.tauxPoursuiteEtude}
          setTendance={(tauxPoursuiteEtude) =>
            setFilters({ ...filters, tauxPoursuiteEtude })
          }
        />
      </SimpleGrid>
    </TabPanel>
  );
};
