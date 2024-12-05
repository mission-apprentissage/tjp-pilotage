import { usePlausible } from "next-plausible";

import { useFormationContext } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/context/formationContext";
import { ExportMenuButton } from "@/components/ExportMenuButton";

export const ExportListIndicateurs = () => {
  const trackEvent = usePlausible();
  const context = useFormationContext();

  const onExportCsv = async () => {};

  const onExportExcel = async () => {};

  return <ExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="ghost" />;
};
