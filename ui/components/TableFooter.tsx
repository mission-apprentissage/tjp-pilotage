import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
export const TableFooter = ({
  pageSize,
  page,
  count = 0,
  onPageChange,
  downloadLink,
  onExport,
}: {
  pageSize: number;
  page: number;
  count?: number;
  onPageChange: (page: number) => void;
  downloadLink?: string;
  onExport?: () => void;
}) => {
  return (
    <Flex align="center" borderTop="1px solid" borderColor="grey.900" py="1.5">
      {downloadLink && (
        <Button
          onClick={onExport}
          href={downloadLink}
          as="a"
          mr="auto"
          size="sm"
          variant="ghost"
        >
          <DownloadIcon mr="2" />
          Exporter en CSV
        </Button>
      )}
      <Box mr="4">
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
};
