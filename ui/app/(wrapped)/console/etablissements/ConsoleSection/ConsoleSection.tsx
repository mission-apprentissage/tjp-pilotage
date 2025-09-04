import { Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { Fragment, useRef, useState } from "react";
import type { UserType } from "shared/schema/userSchema";

import { GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED } from "@/app/(wrapped)/console/etablissements/GROUPED_FORMATION_ETABLISSEMENT_COLUMNS";
import type { Etablissements, Filters, FORMATION_ETABLISSEMENT_COLUMNS_KEYS, Order } from "@/app/(wrapped)/console/etablissements/types";

import { HeadLineContent } from "./HeadLineContent";
import { EtablissementLineContent } from "./LineContent";

const getCellBgColor = (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => {
  const groupLabel = Object.keys(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED).find((groupLabel) => {
    return Object.keys(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[groupLabel].options).includes(column);
  });
  return GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[groupLabel as string].cellColor;
};

export const ConsoleSection = ({
  data,
  filters,
  order,
  setSearchParams,
  colonneFilters,
  user
}: {
  data?: Etablissements;
  filters: Partial<Filters>;
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  colonneFilters: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
  user?: UserType;
}) => {
  const [stickyColonnes, setStickyColonnes] = useState<FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]>(["libelleEtablissement", "libelleFormation"]);
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <TableContainer overflowY="auto" flex={1} ref={tableRef} pb={6} m={0}>
      <Table variant="simple" size={"sm"}>
        <HeadLineContent
          order={order}
          setSearchParams={setSearchParams}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          user={user}
          filters={filters}
        />
        <Tbody>
          {data?.etablissements.map((line) => (
            <Fragment key={`${line.uai}_${line.codeDispositif}_${line.cfd}`}>
              <Tr h="12" bg={"white"} role="group">
                <EtablissementLineContent
                  stickyColonnes={stickyColonnes}
                  line={line}
                  colonneFilters={colonneFilters}
                  filters={filters}
                  getCellBgColor={getCellBgColor}
                  user={user}
                />
              </Tr>
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
