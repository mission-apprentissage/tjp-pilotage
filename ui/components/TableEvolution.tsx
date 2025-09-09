import { Table, Tbody, Td, Tooltip, Tr } from "@chakra-ui/react";

import { formatNumberToString, formatPercentage } from "@/utils/formatUtils";

type GraphData = Record<string, number | string | undefined>;

export const TableEvolution = ({
  data,
  isPercentage = false,
  keys
}: {
  data: GraphData;
  isPercentage?: boolean;
  keys: string[];
}) => {
  const getCellContent = (key: string) => {
    if (typeof data[key] === "string") return data[key];
    return isPercentage
      ? formatPercentage(data[key], 1, "-")
      : formatNumberToString(data[key], 1, "-");
  };
  return (
    <Table variant="unstyled" size="sm">
      <Tbody>
        <Tr>
          {
            keys.map((key) => (
              <Td key={key} textAlign="center" w={10} maxW={10} p={0}>
                <Tooltip label={key}>
                  {getCellContent(key)}
                </Tooltip>
              </Td>
            ))}
        </Tr>
      </Tbody>
    </Table>
  );
};
