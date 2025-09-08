import { Text, useToken } from "@chakra-ui/react";
import type { BarSeriesOption } from "echarts";
import { useMemo } from "react";
import type {ScopeZone} from "shared";
import { VoieEnum } from "shared";

import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import type { FormationIndicateurs } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { BadgeScope } from "@/components/BadgeScope";
import { TooltipIcon } from "@/components/TooltipIcon";

import { displaySoldeDePlacesTransformees } from "./displayIndicators";
import { SoldeDePlacesTransformeesGraph } from "./SoldeDePlacesTransformeesGraph";

const labelColor = (data: number) => {
  if (data > 0) {
    return "green";
  }

  if (data < 0) {
    return "red";
  }

  return "black";
};

const dataStyle = (data: number) => ({
  itemStyle: {
    borderRadius: [data >= 0 ? 4 : 0, data >= 0 ? 4 : 0, data >= 0 ? 0 : 4, data >= 0 ? 0 : 4],
  },
  label: {
    color: labelColor(data),
  },
});

export const SoldeDePlacesTransformeesCard = ({ scope, data }: { scope: ScopeZone; data: FormationIndicateurs }) => {
  const [blue, mustard] = useToken("colors", ["blueCumulus.526", "yellowMoutarde.679"]);
  const { currentFilters: { voie } } = useFormationContext();
  const series: BarSeriesOption[] = useMemo(() => {
    const s: BarSeriesOption[] = [];
    if (voie === VoieEnum.scolaire || !voie) {
      s.push(
        {
          name: "Voie scolaire",
          color: blue,
          type: "bar",
          data: data.soldePlacesTransformee.map((s) => ({
            value: s.scolaire,
            ...dataStyle(s.scolaire!),
          }))
        }
      );
    }

    if (voie === VoieEnum.apprentissage || !voie) {
      s.push(
        {
          name: "Apprentissage",
          color: mustard,
          type: "bar",
          data: data.soldePlacesTransformee.map((s) => ({
            value: s.apprentissage,
            ...dataStyle(s.apprentissage!),
          })),
        },
      );
    }

    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <DashboardCard
      label="Solde de places transformées"
      badge={<BadgeScope scope={scope} />}
      tooltip={<TooltipIcon label="Total des places ouvertes moins total des places fermées" ml={2} />}
      w={"50%"}
    >
      {displaySoldeDePlacesTransformees(data) ? (
        <SoldeDePlacesTransformeesGraph
          series={series}
          xAxisData={data.soldePlacesTransformee.map((s) => `RS ${s.rentreeScolaire.toString()}`)}
        />
      ) : (
        <Text>Indisponible</Text>
      )}
    </DashboardCard>
  );
};
