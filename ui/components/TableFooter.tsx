import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, IconButton } from "@chakra-ui/react";

import { ExportMenuButton } from "./ExportMenuButton";

export const TableFooter = chakra(
  ({
    pageSize,
    page,
    count = 0,
    onPageChange,
    onExportCsv,
    onExportExcel,
    className,
  }: {
    pageSize: number;
    page: number;
    count?: number;
    onPageChange: (page: number) => void;
    onExportCsv?: () => Promise<void>;
    onExportExcel?: () => Promise<void>;
    className?: string;
  }) => {
    return (
      <Flex align="center" borderTop="1px solid" borderColor="grey.900" py="1.5" className={className}>
        <Flex mr="auto">
          {(onExportCsv || onExportExcel) && (
            <ExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} />
          )}
        </Flex>
        <Box mr="4" ml="auto">
          {page * pageSize} - {Math.min((page + 1) * pageSize, count)} sur {count}
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
