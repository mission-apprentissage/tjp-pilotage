import { Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
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

  const [isFirstColumnSticky, setIsFirstColumnSticky] = useState(false);
  const [isSecondColumnSticky, setIsSecondColumnSticky] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tableRef.current) {
      const scrollLeft = tableRef.current.scrollLeft;
      if (scrollLeft > 90 && scrollLeft <= 470) {
        setIsFirstColumnSticky(true);
      } else {
        setIsFirstColumnSticky(false);
      }
      if (scrollLeft > 475) {
        setIsSecondColumnSticky(true);
      } else {
        setIsSecondColumnSticky(false);
      }
    }
  };

  useEffect(() => {
    const box = tableRef.current;
    if (box) {
      box.addEventListener("scroll", handleScroll);
      return () => {
        box.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <TableContainer overflowY="auto" ref={tableRef}>
      <Table variant="simple" size={"sm"}>
        <HeadLineContent
          isFirstColumnSticky={isFirstColumnSticky}
          isSecondColumnSticky={isSecondColumnSticky}
          order={order}
          setSearchParams={setSearchParams}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          user={user}
        />
        <Tbody>
          {data?.etablissements.map((line) => (
            <Fragment key={`${line.uai}_${line.codeDispositif}_${line.cfd}`}>
              <Tr h="12" bg={"white"} role="group">
                <EtablissementLineContent
                  isFirstColumnSticky={isFirstColumnSticky}
                  isSecondColumnSticky={isSecondColumnSticky}
                  line={line}
                  colonneFilters={colonneFilters}
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
