import { usePlausible } from "next-plausible";

import type {
  Formation,
  FormationIndicateurs,
  TauxIJType,
  TauxIJValues,
  TauxPressionValue,
  TauxRemplissageValue,
} from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import type { ExportColumns } from "@/utils/downloadExport";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";

const transformEffectifs = (effectifs: { rentreeScolaire: string; effectif: number }[]) => {
  return effectifs.reduce(
    (acc, { rentreeScolaire, effectif }) => ({
      ...acc,
      [`effectif ${rentreeScolaire}`]: effectif,
    }),
    {} as Record<string, number>
  );
};

const transformEtablissements = (etablissements: { rentreeScolaire: string; nbEtablissements: number }[]) => {
  return etablissements.reduce(
    (acc, { rentreeScolaire, nbEtablissements }) => ({
      ...acc,
      [`etablissements ${rentreeScolaire}`]: nbEtablissements,
    }),
    {} as Record<string, number>
  );
};

const transformTauxIJ = (taux: TauxIJType, tauxIJ: TauxIJValues) => {
  return tauxIJ.reduce(
    (acc, { libelle, scolaire, apprentissage }) => ({
      ...acc,
      [`${taux} ${libelle} - scolaire`]: scolaire,
      [`${taux} ${libelle} - apprentissage`]: apprentissage,
    }),
    {} as Record<string, number | undefined>
  );
};

const transformTauxPressions = (tauxPressions: TauxPressionValue[]) => {
  return tauxPressions.reduce(
    (acc, { rentreeScolaire, scope, value }) => ({
      ...acc,
      [`tauxPressions ${rentreeScolaire} - ${scope}`]: value,
    }),
    {} as Record<string, number | undefined>
  );
};

const transformTauxRemplissages = (tauxRemplissages: TauxRemplissageValue[]) => {
  return tauxRemplissages.reduce(
    (acc, { rentreeScolaire, scope, value }) => ({
      ...acc,
      [`tauxRemplissages ${rentreeScolaire} - ${scope}`]: value,
    }),
    {} as Record<string, number | undefined>
  );
};

const extractDatas = ({ formation, indicateurs }: { formation: Formation; indicateurs: FormationIndicateurs }) => {
  const { libelle, ...restOfFormation } = formation;

  const { tauxIJ, tauxPressions, tauxRemplissages, effectifs, etablissements } = indicateurs;

  const datas = {
    ...restOfFormation,
    libelleFormation: libelle,
    ...transformEtablissements(etablissements),
    ...transformEffectifs(effectifs),
    ...transformTauxIJ("tauxInsertion", tauxIJ.tauxInsertion),
    ...transformTauxIJ("tauxPoursuite", tauxIJ.tauxPoursuite),
    ...transformTauxIJ("tauxDevenirFavorable", tauxIJ.tauxDevenirFavorable),
    ...transformTauxPressions(tauxPressions),
    ...transformTauxRemplissages(tauxRemplissages),
  };

  return datas;
};

const columns: ExportColumns<Record<string, string | number | undefined>> = {
  cfd: "CFD",
  isFormationRenovee: "Formation renovée",
  isBTS: "BTS",
  isApprentissage: "Apprentissage",
  isScolaire: "Scolaire",
  isTransitionDemographique: "Transition démographique",
  isTransitionEcologique: "Transition écologique",
  isTransitionNumerique: "Transition numérique",
  libelleFormation: "Formation",
  ["etablissements 2020"]: "Etablissements 2020",
  ["etablissements 2021"]: "Etablissements 2021",
  ["etablissements 2022"]: "Etablissements 2022",
  ["etablissements 2023"]: "Etablissements 2023",
  ["effectif 2020"]: "Effectif 2020",
  ["effectif 2021"]: "Effectif 2021",
  ["effectif 2022"]: "Effectif 2022",
  ["effectif 2023"]: "Effectif 2023",
  ["tauxInsertion 2020 - scolaire"]: "Taux d'insertion 2020 - scolaire",
  ["tauxInsertion 2020 - apprentissage"]: "Taux d'insertion 2020 - apprentissage",
  ["tauxPoursuite 2020 - scolaire"]: "Taux de poursuite 2020 - scolaire",
  ["tauxDevenirFavorable 2020 - scolaire"]: "Taux de devenir favorable 2020 - scolaire",
  ["tauxPressions 2023 - scolaire"]: "Taux de pressions 2023 - scolaire",
  ["tauxRemplissages 2023 - scolaire"]: "Taux de remplissages 2023 - scolaire",
  ["tauxDevenirFavorable 2019+20 - apprentissage"]: "Taux de devenir favorable 2019+20 - apprentissage",
  ["tauxDevenirFavorable 2019+20 - scolaire"]: "Taux de devenir favorable 2019+20 - scolaire",
  ["tauxDevenirFavorable 2020+21 - apprentissage"]: "Taux de devenir favorable 2020+21 - apprentissage",
  ["tauxDevenirFavorable 2020+21 - scolaire"]: "Taux de devenir favorable 2020+21 - scolaire",
  ["tauxDevenirFavorable 2021+22 - apprentissage"]: "Taux de devenir favorable 2021+22 - apprentissage",
  ["tauxInsertion 2019+20 - apprentissage"]: "Taux d'insertion 2019+20 - apprentissage",
  ["tauxInsertion 2019+20 - scolaire"]: "Taux d'insertion 2019+20 - scolaire",
  ["tauxInsertion 2020+21 - apprentissage"]: "Taux d'insertion 2020+21 - apprentissage",
  ["tauxInsertion 2020+21 - scolaire"]: "Taux d'insertion 2020+21 - scolaire",
  ["tauxInsertion 2021+22 - apprentissage"]: "Taux d'insertion 2021+22 - apprentissage",
  ["tauxInsertion 2021+22 - scolaire"]: "Taux d'insertion 2021+22 - scolaire",
  ["tauxPoursuite 2019+20 - apprentissage"]: "Taux de poursuite 2019+20 - apprentissage",
  ["tauxPoursuite 2019+20 - scolaire"]: "Taux de poursuite 2019+20 - scolaire",
  ["tauxPoursuite 2020+21 - apprentissage"]: "Taux de poursuite 2020+21 - apprentissage",
  ["tauxPoursuite 2020+21 - scolaire"]: "Taux de poursuite 2020+21 - scolaire",
  ["tauxPoursuite 2021+22 - apprentissage"]: "Taux de poursuite 2021+22 - apprentissage",
  ["tauxPoursuite 2021+22 - scolaire"]: "Taux de poursuite 2021+22 - scolaire",
  ["tauxPressions 2020 - académie"]: "Taux de pressions 2020 - académie",
  ["tauxPressions 2020 - département"]: "Taux de pressions 2020 - département",
  ["tauxPressions 2020 - national"]: "Taux de pressions 2020 - national",
  ["tauxPressions 2020 - région"]: "Taux de pressions 2020 - région",
  ["tauxPressions 2021 - académie"]: "Taux de pressions 2021 - académie",
  ["tauxPressions 2021 - département"]: "Taux de pressions 2021 - département",
  ["tauxPressions 2021 - national"]: "Taux de pressions 2021 - national",
  ["tauxPressions 2021 - région"]: "Taux de pressions 2021 - région",
  ["tauxPressions 2022 - académie"]: "Taux de pressions 2022 - académie",
  ["tauxPressions 2022 - département"]: "Taux de pressions 2022 - département",
  ["tauxPressions 2022 - national"]: "Taux de pressions 2022 - national",
  ["tauxPressions 2022 - région"]: "Taux de pressions 2022 - région",
  ["tauxPressions 2023 - académie"]: "Taux de pressions 2023 - académie",
  ["tauxPressions 2023 - département"]: "Taux de pressions 2023 - département",
  ["tauxPressions 2023 - national"]: "Taux de pressions 2023 - national",
  ["tauxPressions 2023 - région"]: "Taux de pressions 2023 - région",
  ["tauxRemplissages 2020 - académie"]: "Taux de remplissages 2020 - académie",
  ["tauxRemplissages 2020 - département"]: "Taux de remplissages 2020 - département",
  ["tauxRemplissages 2020 - national"]: "Taux de remplissages 2020 - national",
  ["tauxRemplissages 2020 - région"]: "Taux de remplissages 2020 - région",
  ["tauxRemplissages 2021 - académie"]: "Taux de remplissages 2021 - académie",
  ["tauxRemplissages 2021 - département"]: "Taux de remplissages 2021 - département",
  ["tauxRemplissages 2021 - national"]: "Taux de remplissages 2021 - national",
  ["tauxRemplissages 2021 - région"]: "Taux de remplissages 2021 - région",
  ["tauxRemplissages 2022 - académie"]: "Taux de remplissages 2022 - académie",
  ["tauxRemplissages 2022 - département"]: "Taux de remplissages 2022 - département",
  ["tauxRemplissages 2022 - national"]: "Taux de remplissages 2022 - national",
  ["tauxRemplissages 2022 - région"]: "Taux de remplissages 2022 - région",
  ["tauxRemplissages 2023 - académie"]: "Taux de remplissages 2023 - académie",
  ["tauxRemplissages 2023 - département"]: "Taux de remplissages 2023 - département",
  ["tauxRemplissages 2023 - national"]: "Taux de remplissages 2023 - national",
  ["tauxRemplissages 2023 - région"]: "Taux de remplissages 2023 - région",
};

export const ExportListIndicateurs = ({
  formation,
  indicateurs,
}: {
  formation: Formation;
  indicateurs: FormationIndicateurs;
}) => {
  const trackEvent = usePlausible();

  const onExportCsv = async () => {
    trackEvent("domaine-de-formation:indicateurs:export-csv");

    downloadCsv(
      formatExportFilename("domaine-de-formation_etablissements"),
      [extractDatas({ formation, indicateurs })],
      columns
    );
  };

  const onExportExcel = async () => {
    trackEvent("domaine-de-formation:indicateurs:export-excel");

    downloadExcel(
      formatExportFilename("domaine-de-formation_etablissements"),
      [extractDatas({ formation, indicateurs })],
      columns
    );
  };

  return <ExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="ghost" />;
};
