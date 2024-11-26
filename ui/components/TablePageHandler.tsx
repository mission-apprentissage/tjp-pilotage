import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, IconButton } from "@chakra-ui/react";

export const TablePageHandler = chakra(
  ({
    pageSize,
    page,
    count = 0,
    onPageChange,
    className,
  }: {
    pageSize: number;
    page: number;
    count?: number;
    onPageChange: (page: number) => void;
    className?: string;
  }) => {
    return (
      <Flex className={className}>
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
