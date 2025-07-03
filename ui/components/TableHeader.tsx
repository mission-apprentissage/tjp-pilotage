import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { chakra, Flex, IconButton, Text } from "@chakra-ui/react";

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
      <Flex direction="column" >
        <Flex align="center" py="1.5" px={0} className={className} gap={2} maxW={"100%"} overflowY={"hidden"}>
          {SearchInput}
          <Flex ms={ColonneFilter ? "none" : "auto"}>
            {(onExportCsv || onExportExcel) && (
              <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="externalLink" />
            )}
          </Flex>
          {SaveFiltersButton}
          <Flex ms={ColonneFilter ? "auto" : "none"} minW={"fit-content"}>
            <Text mx="4" my="auto">
              {page * pageSize} - {Math.min((page + 1) * pageSize, count)} sur {count}
            </Text>
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
        <Flex direction="row">
          <Flex ms={"auto"}>
            {ColonneFilter}
          </Flex>


        </Flex>
      </Flex>
    );
  }
);
