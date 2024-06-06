import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

const ExportButton = ({
  onExport,
  type = "csv",
}: {
  onExport?: () => Promise<void>;
  type?: "csv" | "excel";
}) => {
  if (!onExport) return null;
  return type === "csv" ? (
    <MenuItem onClick={onExport} fontSize="14px" fontWeight={500} gap={2} p={2}>
      <Icon icon="ri:file-text-line" />
      Format CSV (.csv)
    </MenuItem>
  ) : (
    <MenuItem onClick={onExport} fontSize="14px" fontWeight={500} gap={2} p={2}>
      <Icon icon="ri:file-excel-2-line" />
      Format Excel (.xlsx)
    </MenuItem>
  );
};
export const ExportMenuButton = ({
  onExportCsv,
  onExportExcel,
  variant = "ghost",
}: {
  onExportCsv?: () => Promise<void>;
  onExportExcel?: () => Promise<void>;
  variant?: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExportCsv = async () => {
    if (onExportCsv && !isLoading) {
      setIsLoading(true);
      await onExportCsv();
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (onExportExcel && !isLoading) {
      setIsLoading(true);
      await onExportExcel();
      setIsLoading(false);
    }
  };

  if (!handleExportCsv && !handleExportExcel) return null;

  if (isLoading) {
    return (
      <Button mr="auto" variant="ghost" size="md" disabled={true}>
        <Spinner mr="2" size="sm" />
        Export en cours...
      </Button>
    );
  }
  return (
    <Menu gutter={0}>
      <MenuButton
        as={Button}
        variant={variant}
        size="md"
        leftIcon={<DownloadIcon />}
      >
        Exporter
      </MenuButton>
      <MenuList p={0} zIndex={"tooltip"}>
        <ExportButton onExport={handleExportCsv} />
        <ExportButton onExport={handleExportExcel} type={"excel"} />
      </MenuList>
    </Menu>
  );
};
