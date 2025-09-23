import { Badge, Flex, Img, Text, Tooltip } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

const CODE_NIVEAU_DIPLOME_BTS = "320";
const getCompareData = ({
  premiersVoeux,
  premiersVoeuxAnneePrecedente,
}: {
  premiersVoeux?: number;
  premiersVoeuxAnneePrecedente?: number;
}) => {
  if (!premiersVoeux || !premiersVoeuxAnneePrecedente) return "";
  if (premiersVoeux > premiersVoeuxAnneePrecedente) {
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Flex color="success.425">
          <Img src={"/icons/arrow_up.svg"} alt="Icône tendance à la hausse" />
          <Text fontWeight={"bold"}>{`+${premiersVoeux - premiersVoeuxAnneePrecedente}`}</Text>
        </Flex>
      </Tooltip>
    );
  } else if (premiersVoeux < premiersVoeuxAnneePrecedente) {
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Flex color="warning.525">
          <Img src={"/icons/arrow_down.svg"} alt="Icône tendance à la baisse" />
          <Text fontWeight={"bold"}>{`${premiersVoeux - premiersVoeuxAnneePrecedente}`}</Text>
        </Flex>
      </Tooltip>
    );
  }
  return (
    <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
      <Text fontWeight={"bold"}>+0pts</Text>
    </Tooltip>
  );
};

export const PremiersVoeux = ({
  codeNiveauDiplome,
  premiersVoeux,
  premiersVoeuxAnneePrecedente,
}: {
  codeNiveauDiplome?: string;
  premiersVoeux?: number;
  premiersVoeuxAnneePrecedente?: number;
}) => {
  return (
    <DashboardCard
      label={codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Nombre de voeux" : "Nombre de 1ers voeux"}
      tooltip={
        <GlossaireShortcut
          display={"inline"}
          marginInline={1}
          glossaireEntryKey="voeux"
          tooltip={
            <Flex direction="column" gap={2}>
              <Text>{codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Nombre total de vœux (Parcoursup)" : "Nombre de vœux de 1ère position (Affelnet)"}</Text>
              <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
            </Flex>
          }
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      <CounterChart
        data={premiersVoeux}
        compareData={getCompareData({ premiersVoeux, premiersVoeuxAnneePrecedente })}
      />
    </DashboardCard>
  );
};
