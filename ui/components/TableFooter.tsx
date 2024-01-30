import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";

const ExportButton = ({ onExport }: { onExport?: () => Promise<void> }) => {
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleExport = async () => {
    if (onExport && !loading) {
      setIsLoading(true);
      await onExport();
      setIsLoading(false);
    }
  };

  if (!onExport) return null;

  if (loading) {
    return (
      <Button mr="auto" size="sm" variant="ghost" disabled={true}>
        <Spinner mr="2" size="sm" />
        Export en cours...
      </Button>
    );
  }

  return (
    <Button onClick={handleExport} mr="auto" size="sm" variant="ghost">
      <DownloadIcon mr="2" />
      Exporter en CSV
    </Button>
  );
};

export const TableFooter = chakra(
  ({
    pageSize,
    page,
    count = 0,
    onPageChange,
    onExport,
    className,
  }: {
    pageSize: number;
    page: number;
    count?: number;
    onPageChange: (page: number) => void;
    onExport?: () => Promise<void>;
    className?: string;
  }) => {
    return (
      <Flex
        align="center"
        borderTop="1px solid"
        borderColor="grey.900"
        py="1.5"
        className={className}
      >
        <ExportButton onExport={onExport} />
        <Box mr="4" ml="auto">
          {page * pageSize} - {Math.min((page + 1) * pageSize, count)} sur{" "}
          {count}
        </Box>
        <IconButton
          isDisabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          size="sm"
          aria-label="Page précédente"
          icon={<ArrowLeftIcon />}
        />
        <IconButton
          isDisabled={(page + 1) * pageSize >= count}
          onClick={() => onPageChange(page + 1)}
          ml="2"
          size="sm"
          aria-label="Page suivante"
          icon={<ArrowRightIcon />}
        />
      </Flex>
    );
  }
);
