import { chakra, Tag, Td } from "@chakra-ui/react";

import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { formatCommuneLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { getTauxPressionStyle } from "@/utils/getBgScale";
import { roundNumber } from "@/utils/roundNumber";

import {
  getMotifCorrectionLabel,
  MotifCorrectionCampagne,
  MotifCorrectionLabel,
} from "../../utils/motifCorrectionUtils";
import {
  getRaisonCorrectionLabel,
  RaisonCorrectionCampagne,
  RaisonCorrectionLabel,
} from "../../utils/raisonCorrectionUtils";
import { CORRECTIONS_COLUMNS } from "../CORRECTIONS_COLUMN";
import { Corrections } from "../types";

const formatEcart = (value: number) => {
  if (value > 0)
    return (
      <Tag
        size={"lg"}
        color="success.425"
        bgColor={"success.950"}
      >{`+${value}`}</Tag>
    );
  if (value === 0) return <Tag size={"lg"}>{value}</Tag>;
  return (
    <Tag size={"lg"} color="error.425" bgColor={"error.950"}>
      {value}
    </Tag>
  );
};

const handleRaisonLabel = ({
  raison,
  campagne,
}: {
  raison?: string;
  campagne?: string;
}) => {
  return getRaisonCorrectionLabel({
    raison: raison as RaisonCorrectionLabel,
    campagne: campagne as RaisonCorrectionCampagne,
  });
};

const handleMotifCorrectionLabel = ({
  motifsCorrection,
  autreMotif,
  campagne,
}: {
  motifsCorrection?: string[];
  campagne?: string;
  autreMotif?: string;
}) => {
  if (!motifsCorrection || motifsCorrection.length === 0) return undefined;
  const formattedMotifs = motifsCorrection?.map((motifCorrection) =>
    motifCorrection === "autre"
      ? `Autre : ${autreMotif}`
      : getMotifCorrectionLabel({
          motifCorrection: motifCorrection as MotifCorrectionLabel,
          campagne: campagne as MotifCorrectionCampagne,
        })
  );
  return `(${formattedMotifs.length}) ${formattedMotifs?.join(", ")}`;
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
  getCellColor,
}: {
  correction: Corrections["corrections"][0];
  campagne?: string;
  colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
  getCellColor: (column: keyof typeof CORRECTIONS_COLUMNS) => string;
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
        bgColor={getCellColor("libelleEtablissement")}
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
        bgColor={getCellColor("commune")}
      >
        {formatCommuneLibelleWithCodeDepartement({
          commune: correction.commune,
          codeDepartement: correction.codeDepartement,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleRegion"}
        bgColor={getCellColor("libelleRegion")}
      >
        {correction.libelleRegion}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        bgColor={getCellColor("libelleAcademie")}
      >
        {correction.libelleAcademie}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"secteur"}
        bgColor={getCellColor("secteur")}
      >
        {correction.secteur === "PU" ? "Public" : "Privé"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleNsf"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleNsf")}
      >
        {correction.libelleNsf}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleFormation")}
      >
        {correction.libelleFormation}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"niveauDiplome"}
        bgColor={getCellColor("niveauDiplome")}
      >
        {correction.niveauDiplome}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxInsertionRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxInsertionRegional")}
      >
        <GraphWrapper value={correction.tauxInsertionRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxPoursuiteRegional")}
      >
        <GraphWrapper value={correction.tauxPoursuiteRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxDevenirFavorableRegional")}
      >
        <GraphWrapper value={correction.tauxDevenirFavorableRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPressionRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxPressionRegional")}
      >
        <TableBadge sx={getTauxPressionStyle(correction.tauxPressionRegional)}>
          {typeof correction.tauxPressionRegional !== "undefined"
            ? roundNumber(correction.tauxPressionRegional)
            : "-"}
        </TableBadge>
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbEtablissement"}
        isNumeric
        bgColor={getCellColor("nbEtablissement")}
      >
        {correction.nbEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
        isNumeric
        bgColor={getCellColor("positionQuadrant")}
      >
        {correction.positionQuadrant ?? "-"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"capaciteScolaireCorrigee"}
        textAlign={"center"}
        bgColor={getCellColor("capaciteScolaireCorrigee")}
      >
        {correction.capaciteScolaireCorrigee ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"ecartScolaire"}
        textAlign={"center"}
        bgColor={getCellColor("ecartScolaire")}
      >
        {formatEcart(correction.ecartScolaire ?? 0)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"capaciteApprentissageCorrigee"}
        textAlign={"center"}
        bgColor={getCellColor("capaciteApprentissageCorrigee")}
      >
        {correction.capaciteApprentissageCorrigee ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"ecartApprentissage"}
        textAlign={"center"}
        bgColor={getCellColor("ecartApprentissage")}
      >
        {formatEcart(correction.ecartApprentissage ?? 0)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"raisonCorrection"}
        bgColor={getCellColor("raisonCorrection")}
      >
        {handleRaisonLabel({
          raison: correction.raisonCorrection,
          campagne: campagne,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"motifCorrection"}
        minW={400}
        maxW={400}
        textOverflow={"ellipsis"}
        isTruncated={true}
        bgColor={getCellColor("motifCorrection")}
      >
        {handleMotifCorrectionLabel({
          motifsCorrection: correction.motifCorrection,
          autreMotif: correction.autreMotifCorrection,
          campagne: campagne,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleColoration")}
      >
        {correction.libelleColoration}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"commentaire"}
        bgColor={getCellColor("commentaire")}
      >
        {correction.commentaire}
      </ConditionalTd>
    </>
  );
};
