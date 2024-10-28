import { z } from "zod";

export const PageRequeteEnregistreeZodType = z.enum([
  "formation",
  "formationEtablissement",
]);

export const PageRequeteEnregistreeTypeEnum =
  PageRequeteEnregistreeZodType.Enum;

export type PageRequeteEnregistreeType = z.infer<
  typeof PageRequeteEnregistreeZodType
>;
