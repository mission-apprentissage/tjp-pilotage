import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, IconButton } from "@chakra-ui/react";

import { AdvancedExportMenuButton } from "./AdvancedExportMenuButton";

export const TableHeader = chakra(
  ({
    pageSize,
    page,
    count = 0,
    onPageChange,
    onExportCsv,
    onExportExcel,
    className,
    SaveFiltersButton,
    ColonneFilter,
    SearchInput,
  }: {
    pageSize: number;
    page: number;
    count?: number;
    onPageChange: (page: number) => void;
    onExportCsv?: (isFiltered?: boolean) => Promise<void>;
    onExportExcel?: (isFiltered?: boolean) => Promise<void>;
    className?: string;
    SaveFiltersButton?: React.ReactNode;
    ColonneFilter?: React.ReactNode;
    SearchInput?: React.ReactNode;
  }) => {
    return (
      <Flex align="center" py="1.5" px={0} className={className} gap={4}>
        {SearchInput}
        <Flex ms={ColonneFilter ? "none" : "auto"}>
          {(onExportCsv || onExportExcel) && (
            <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="externalLink" />
          )}
        </Flex>
        {SaveFiltersButton}
        {ColonneFilter}
        <Flex ms={ColonneFilter ? "auto" : "none"} mt={"auto"}>
          <Box mx="4">
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
      </Flex>
    );
  }
);
