import { chakra, Tag, Td } from "@chakra-ui/react";
import { SecteurEnum } from "shared/enum/secteurEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import { unEscapeString } from "shared/utils/escapeString";

import type { CORRECTIONS_COLUMNS } from "@/app/(wrapped)/intentions/corrections/CORRECTIONS_COLUMN";
import type { Corrections } from "@/app/(wrapped)/intentions/corrections/types";
import type {
  AnneeCampagneMotifCorrection,
  MotifCorrectionLabel,
} from "@/app/(wrapped)/intentions/utils/motifCorrectionUtils";
import { getMotifCorrectionLabel } from "@/app/(wrapped)/intentions/utils/motifCorrectionUtils";
import type {
  AnneeCampagneRaisonCorrection,
  RaisonCorrectionLabel,
} from "@/app/(wrapped)/intentions/utils/raisonCorrectionUtils";
import { getRaisonCorrectionLabelParAnneeCampagne } from "@/app/(wrapped)/intentions/utils/raisonCorrectionUtils";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { formatCommuneLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

const formatEcart = (value: number) => {
  if (value > 0) return <Tag size={"lg"} color="success.425" bgColor={"success.950"}>{`+${value}`}</Tag>;
  if (value === 0) return <Tag size={"lg"}>{value}</Tag>;
  return (
    <Tag size={"lg"} color="error.425" bgColor={"error.950"}>
      {value}
    </Tag>
  );
};

const handleRaisonLabel = ({ raison, anneeCampagne }: { raison?: string; anneeCampagne: string }) => {
  return getRaisonCorrectionLabelParAnneeCampagne({
    raison: raison as RaisonCorrectionLabel,
    anneeCampagne: anneeCampagne as AnneeCampagneRaisonCorrection,
  });
};

const handleMotifCorrectionLabel = ({
  motifCorrection,
  autreMotif,
  anneeCampagne,
}: {
  motifCorrection?: string;
  autreMotif?: string;
  anneeCampagne: string;
}) => {
  return motifCorrection === "autre"
    ? `Autre : ${unEscapeString(autreMotif)}`
    : getMotifCorrectionLabel({
      motifCorrection: motifCorrection as MotifCorrectionLabel,
      anneeCampagne: anneeCampagne as AnneeCampagneMotifCorrection,
    });
};
const ConditionalTd = chakra(
  ({
    className,
    colonneFilters,
    colonne,
    children,
    isNumeric = false,
  }: {
    className?: string;
    colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
    colonne: keyof typeof CORRECTIONS_COLUMNS;
    children: React.ReactNode;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Td
          className={className}
          isNumeric={isNumeric}
          border={"none"}
          whiteSpace={"normal"}
          _groupHover={{ bgColor: "blueecume.850 !important" }}
        >
          {children}
        </Td>
      );
    return null;
  }
);

export const LineContent = ({
  correction,
  campagne,
  colonneFilters,
  getCellBgColor,
}: {
  correction: Corrections["corrections"][0];
  campagne: CampagneType;
  colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
  getCellBgColor: (column: keyof typeof CORRECTIONS_COLUMNS) => string;
}) => {
  return (
    <>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleEtablissement"}
        minW={300}
        maxW={300}
        left={0}
        position="sticky"
        zIndex={1}
        bgColor={getCellBgColor("libelleEtablissement")}
      >
        {correction.libelleEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"commune"}
        left={colonneFilters.includes("libelleEtablissement") ? 300 : 0}
        position="sticky"
        zIndex={1}
        boxShadow={"inset -2px 0px 0px 0px #E2E8F0"}
        bgColor={getCellBgColor("commune")}
      >
        {formatCommuneLibelleWithCodeDepartement({
          commune: correction.commune,
          codeDepartement: correction.codeDepartement,
        })}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"libelleRegion"} bgColor={getCellBgColor("libelleRegion")}>
        {correction.libelleRegion}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        bgColor={getCellBgColor("libelleAcademie")}
      >
        {correction.libelleAcademie}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"secteur"} bgColor={getCellBgColor("secteur")}>
        {correction.secteur === SecteurEnum["PU"] ? "Public" : "Privé"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleNsf"}
        minW={300}
        maxW={300}
        bgColor={getCellBgColor("libelleNsf")}
      >
        {correction.libelleNsf}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        minW={300}
        maxW={300}
        bgColor={getCellBgColor("libelleFormation")}
      >
        {correction.libelleFormation}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"formationSpecifique"}
        minW={300}
        maxW={300}
        bgColor={getCellBgColor("formationSpecifique")}
      >
        <BadgesFormationSpecifique formationSpecifique={correction.formationSpecifique} />
      </ConditionalTd>

      <ConditionalTd colonneFilters={colonneFilters} colonne={"niveauDiplome"} bgColor={getCellBgColor("niveauDiplome")}>
        {correction.niveauDiplome}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxInsertionRegional"}
        textAlign="center"
        bgColor={getCellBgColor("tauxInsertionRegional")}
      >
        <GraphWrapper value={correction.tauxInsertionRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        textAlign="center"
        bgColor={getCellBgColor("tauxPoursuiteRegional")}
      >
        <GraphWrapper value={correction.tauxPoursuiteRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        textAlign="center"
        bgColor={getCellBgColor("tauxDevenirFavorableRegional")}
      >
        <GraphWrapper value={correction.tauxDevenirFavorableRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPressionRegional"}
        textAlign="center"
        bgColor={getCellBgColor("tauxPressionRegional")}
      >
        <TableBadge sx={getTauxPressionStyle(correction.tauxPressionRegional)}>
          {typeof correction.tauxPressionRegional !== "undefined" ? formatNumber(correction.tauxPressionRegional) : "-"}
        </TableBadge>
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbEtablissement"}
        isNumeric
        bgColor={getCellBgColor("nbEtablissement")}
      >
        {correction.nbEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
        isNumeric
        bgColor={getCellBgColor("positionQuadrant")}
      >
        {correction.positionQuadrant ?? "-"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"capaciteScolaireCorrigee"}
        textAlign={"center"}
        bgColor={getCellBgColor("capaciteScolaireCorrigee")}
      >
        {correction.capaciteScolaireCorrigee ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"ecartScolaire"}
        textAlign={"center"}
        bgColor={getCellBgColor("ecartScolaire")}
      >
        {formatEcart(correction.ecartScolaire ?? 0)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"capaciteApprentissageCorrigee"}
        textAlign={"center"}
        bgColor={getCellBgColor("capaciteApprentissageCorrigee")}
      >
        {correction.capaciteApprentissageCorrigee ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"ecartApprentissage"}
        textAlign={"center"}
        bgColor={getCellBgColor("ecartApprentissage")}
      >
        {formatEcart(correction.ecartApprentissage ?? 0)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"raisonCorrection"}
        bgColor={getCellBgColor("raisonCorrection")}
      >
        {handleRaisonLabel({
          raison: correction.raisonCorrection,
          anneeCampagne: campagne.annee,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"motifCorrection"}
        minW={400}
        maxW={400}
        textOverflow={"ellipsis"}
        isTruncated={true}
        bgColor={getCellBgColor("motifCorrection")}
      >
        {handleMotifCorrectionLabel({
          motifCorrection: correction.motifCorrection,
          autreMotif: correction.autreMotifCorrection,
          anneeCampagne: campagne.annee,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        minW={300}
        maxW={300}
        bgColor={getCellBgColor("libelleColoration")}
      >
        {correction.libelleColoration}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"commentaire"} bgColor={getCellBgColor("commentaire")}>
        {correction.commentaire}
      </ConditionalTd>
    </>
  );
};
