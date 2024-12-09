import { DownloadIcon } from "@chakra-ui/icons";
import type { MenuButtonProps } from "@chakra-ui/react";
import { Button, Divider, Flex, Menu, MenuButton, MenuList, Radio, RadioGroup, Spinner, Text } from "@chakra-ui/react";
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
    <Menu gutter={0}>
      <MenuButton as={Button} variant={variant} size="md" leftIcon={<DownloadIcon />} {...rest}>
        <Flex minW={20}>{isQueryLoading ? <Spinner mr="2" size="sm" /> : "Exporter"}</Flex>
      </MenuButton>
      <MenuList zIndex={1000}>
        <Flex direction={"column"} gap={2} px={3} pt={1}>
          <Text textTransform={"uppercase"} fontWeight={700}>
            Option d'export
          </Text>
          <RadioGroup onChange={setExportType} value={exportType}>
            <Flex direction={"column"} gap={3}>
              <Radio value="filtered" ms={2}>
                Exporter la requête en cours
              </Radio>
              <Radio value="all" ms={2}>
                Exporter toutes les données
              </Radio>
            </Flex>
          </RadioGroup>
          <Divider />
          <Text textTransform={"uppercase"} fontWeight={700}>
            Format
          </Text>
          <RadioGroup onChange={setExportFormat} value={exportFormat}>
            <Flex direction={"column"} gap={3}>
              <Radio value="csv" ms={2}>
                CSV (.csv)
              </Radio>
              <Radio value="excel" ms={2}>
                Excel (.xlsx)
              </Radio>
            </Flex>
          </RadioGroup>
          <Divider />
          <Flex>
            <Button variant={"primary"} onClick={async () => handleExport()} mx={"auto"}>
              Exporter
            </Button>
          </Flex>
        </Flex>
      </MenuList>
    </Menu>
  );
};
