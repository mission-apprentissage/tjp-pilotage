import { DownloadIcon } from "@chakra-ui/icons";
import type { MenuButtonProps } from "@chakra-ui/react";
import { Button, Divider, Flex, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Radio, RadioGroup, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";

type AdvancedExportMenuButtonProps = MenuButtonProps & {
  onExportCsv?: (isFiltered?: boolean) => Promise<void>;
  onExportExcel?: (isFiltered?: boolean) => Promise<void>;
  variant?: string;
  isQueryLoading?: boolean;
};

export const AdvancedExportMenuButton = ({
  onExportCsv,
  onExportExcel,
  variant = "ghost",
  isQueryLoading,
  ...rest
}: AdvancedExportMenuButtonProps) => {
  const [exportType, setExportType] = useState<string>("filtered");
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExportCsv = async () => {
    if (onExportCsv && !isLoading) {
      setIsLoading(true);
      await onExportCsv(exportType === "filtered");
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (onExportExcel && !isLoading) {
      setIsLoading(true);
      await onExportExcel(exportType === "filtered");
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

  const handleExport = async () => {
    if (exportFormat === "csv") {
      await handleExportCsv();
    } else {
      await handleExportExcel();
    }
  };

  return (
    <Menu gutter={0} closeOnSelect={false}>
      <MenuButton as={Button} variant={variant} size="md" leftIcon={<DownloadIcon />} {...rest}>
        <Flex minW={20}>{isQueryLoading ? <Spinner mr="2" size="sm" /> : "Exporter"}</Flex>
      </MenuButton>
      <MenuList zIndex={1000}>
        <MenuOptionGroup
          title="Option d'export"
          textTransform={"uppercase"}
          fontWeight={700}
          mb={2}
          type={"radio"}
          onChange={(value) => setExportType(value as string)}
          value={exportType}
        >
          <MenuItemOption value="filtered" ms={2}>
            Exporter la requête en cours
          </MenuItemOption>
          <MenuItemOption value="all" ms={2}>
            Exporter toutes les données
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup
          title={"Format"}
          textTransform={"uppercase"}
          fontWeight={700}
          mb={2}
          type={"radio"}
          onChange={(value) => setExportFormat(value as string)}
          value={exportFormat}
        >
          <MenuItemOption value="csv" ms={2}>
            CSV (.csv)
          </MenuItemOption>
          <MenuItemOption value="excel" ms={2}>
            Excel (.xlsx)
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem
          as={Button}
          onClick={async () => handleExport()}
          mx={"auto"}
          w={"fit-content"}
          bgColor={"bluefrance.113"}
          color={"white"}
          borderRadius={0}
          fontWeight={400}
          _hover={{
            bg: "bluefrance.113_hover",
            _disabled: { bg: "bluefrance.113" },
          }}
        >
          Exporter
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
