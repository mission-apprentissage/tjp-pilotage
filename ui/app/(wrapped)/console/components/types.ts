import type { client } from "@/api.client";
import type {
  Filters as FiltersEtablissement,
  FiltersList as FiltersListEtablissement,
} from "@/app/(wrapped)/console/etablissements/types";
import type {
  Filters as FiltersFormation,
  FiltersList as FiltersListFormation,
} from "@/app/(wrapped)/console/formations/types";

export type TypePage = (typeof client.inferArgs)["[POST]/requete/enregistrement"]["body"]["page"];

export type RequetesEnregistrees = (typeof client.infer)["[GET]/requetes"];

export type Filters = FiltersFormation | FiltersEtablissement;

export type FiltersList = FiltersListFormation | FiltersListEtablissement;
