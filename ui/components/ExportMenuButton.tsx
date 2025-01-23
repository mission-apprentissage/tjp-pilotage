import { DownloadIcon } from "@chakra-ui/icons";
import type { MenuButtonProps } from "@chakra-ui/react";
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Spinner } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

const ExportButton = ({ onExport, type = "csv" }: { onExport?: () => Promise<void>; type?: "csv" | "excel" }) => {
  if (!onExport) return null;
  return type === "csv" ? (
    <MenuItem onClick={onExport} fontSize={14} fontWeight={500} gap={2} p={2}>
      <Icon icon="ri:file-text-line" />
      Format CSV (.csv)
    </MenuItem>
  ) : (
    <MenuItem onClick={onExport} fontSize={14} fontWeight={500} gap={2} p={2}>
      <Icon icon="ri:file-excel-2-line" />
      Format Excel (.xlsx)
    </MenuItem>
  );
};

type ExportMenuButtonProps = MenuButtonProps & {
  onExportCsv?: () => Promise<void>;
  onExportExcel?: () => Promise<void>;
  variant?: string;
  isQueryLoading?: boolean;
};

export const ExportMenuButton = ({
  onExportCsv,
  onExportExcel,
  variant = "ghost",
  isQueryLoading,
  ...rest
}: ExportMenuButtonProps) => {
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
      <MenuButton as={Button} variant={variant} size="md" leftIcon={<DownloadIcon />} {...rest}>
        <Flex minW={20}>{isQueryLoading ? <Spinner mr="2" size="sm" /> : "Exporter"}</Flex>
      </MenuButton>
      <MenuList p={0} zIndex={"tooltip"}>
        {onExportCsv && <ExportButton onExport={handleExportCsv} />}
        {onExportExcel && <ExportButton onExport={handleExportExcel} type={"excel"} />}
      </MenuList>
    </Menu>
  );
};
