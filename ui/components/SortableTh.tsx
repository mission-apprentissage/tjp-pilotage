import {Box, chakra,Th} from '@chakra-ui/react';
import type { CSSProperties,ReactNode } from "react";

import {getAriaSortValue} from '@/utils/getAriaSortValue';

import { OrderIcon } from "./OrderIcon";

export const SortableTh = chakra((
  {
    order,
    colonne,
    handleOrder,
    className,
    style,
    children,
    isNumeric,
  } : {
    order: {
      order?: "asc" | "desc";
      orderBy?: string;
    };
    colonne: string;
    handleOrder?: (colonne: string) => void;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
    isNumeric?: boolean;
  }
) => {
  return (
    <Th
      role="columnheader"
      cursor={handleOrder ? "pointer" : "inherit"}
      onClick={handleOrder ? () => handleOrder(colonne) : undefined}
      aria-sort={handleOrder ? getAriaSortValue(order?.order) : undefined}
      tabIndex={handleOrder ? 0 : undefined}
      onKeyDown={handleOrder ?
        (e) => {
          if (e.key === "Enter" || e.key === " ") handleOrder(colonne);
        } :
        undefined
      }
      className={className}
      style={style}
      isNumeric={isNumeric}
    >
      <Box
        fontSize={12}
        fontWeight={700}
        lineHeight={"20px"}
        textTransform={"uppercase"}
        textOverflow={"ellipsis"}
        alignSelf={"stretch"}
        isTruncated
        whiteSpace="nowrap"
        display="flex"
        alignItems="center"
      >
        {handleOrder && <OrderIcon {...order} colonne={colonne} />}
        {children}
      </Box>
    </Th>
  );
},
{
  shouldForwardProp: (_prop) => true,
});
