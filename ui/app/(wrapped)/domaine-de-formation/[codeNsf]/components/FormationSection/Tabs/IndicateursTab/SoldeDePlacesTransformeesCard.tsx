import { Text, useToken } from "@chakra-ui/react";
import type { ScopeZone } from "shared";

import type { FormationIndicateurs } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { BadgeScope } from "@/components/BadgeScope";
import { TooltipIcon } from "@/components/TooltipIcon";

import { displaySoldeDePlacesTransformees } from "./displayIndicators";
import { SoldeDePlacesTransformeesGraph } from "./SoldeDePlacesTransformeesGraph";

export const SoldeDePlacesTransformeesCard = ({ scope, data }: { scope: ScopeZone; data: FormationIndicateurs }) => {
  const blue = useToken("colors", "blueCumulus.526");
  const mustard = useToken("colors", "yellowMoutarde.679");
  const dataStyle = (data: number) => ({
    itemStyle: {
      borderRadius: [data >= 0 ? 4 : 0, data >= 0 ? 4 : 0, data >= 0 ? 0 : 4, data >= 0 ? 0 : 4],
    },
    label: {
      color: data > 0 ? "green" : data < 0 ? "red" : "black",
    },
  });

  return (
    <DashboardCard
      label="Solde de places transformées"
      badge={<BadgeScope scope={scope} />}
      tooltip={<TooltipIcon label="Total des places ouvertes moins total des places fermées" ml={2} />}
      w={"50%"}
    >
      {displaySoldeDePlacesTransformees(data) ? (
        <SoldeDePlacesTransformeesGraph
          series={[
            {
              name: "Voie scolaire",
              color: blue,
              type: "bar",
              data: data.soldePlacesTransformee.map((s) => ({
                value: s.scolaire,
                ...dataStyle(s.scolaire),
              })),
            },
            {
              name: "Apprentissage",
              color: mustard,
              type: "bar",
              data: data.soldePlacesTransformee.map((s) => ({
                value: s.apprentissage,
                ...dataStyle(s.apprentissage),
              })),
            },
          ]}
          title="Solde de places transformées"
          xAxisData={data.soldePlacesTransformee.map((s) => `RS ${s.rentreeScolaire.toString()}`)}
        />
      ) : (
        <Text>Indisponible</Text>
      )}
    </DashboardCard>
  );
};
