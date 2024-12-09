import { voie } from "shared/enum/voieEnum";
import { z } from "zod";

import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/etablissement/:uai/analyse-detaillee"]["query"];

const filtersSchema = z.object({
  codeNiveauDiplome: z.array(z.string()),
  voie: z.array(z.enum([...voie.options, "all"] as const)),
});

export type Filters = z.infer<typeof filtersSchema>;
export type AnalyseDetaillee = (typeof client.infer)["[GET]/etablissement/:uai/analyse-detaillee"];
export type Formations = AnalyseDetaillee["formations"];
export type Formation = Formations[string];
export type Etablissement = AnalyseDetaillee["etablissement"];
export type ChiffresIJ = AnalyseDetaillee["chiffresIJ"];
export type ChiffresIJOffre = ChiffresIJ[string];
export type ChiffresIJOffreMillesime = ChiffresIJOffre[string];
export type ChiffresEntree = AnalyseDetaillee["chiffresEntree"];
export type ChiffresEntreeOffre = ChiffresEntree[string];
export type ChiffresEntreeOffreRentree = ChiffresEntreeOffre[string];
export type StatsSortie = AnalyseDetaillee["statsSortie"];
export type FiltersData = AnalyseDetaillee["filters"];
