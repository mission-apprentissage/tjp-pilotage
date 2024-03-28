import { client } from "@/api.client";

export type Query =
  (typeof client.inferArgs)["[GET]/etablissement/:uai/analyse-detaillee"]["query"];

export type Filters = Pick<Query, "codeNiveauDiplome" | "voie">;
export type AnalyseDetaillee =
  (typeof client.infer)["[GET]/etablissement/:uai/analyse-detaillee"];
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
