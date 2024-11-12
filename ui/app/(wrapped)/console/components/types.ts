import { client } from "@/api.client";

import {
  Filters as FiltersEtablissement,
  FiltersList as FiltersListEtablissement,
} from "../etablissements/types";
import {
  Filters as FiltersFormation,
  FiltersList as FiltersListFormation,
} from "../formations/types";

export type TypePage =
  (typeof client.inferArgs)["[POST]/requete/enregistrement"]["body"]["page"];

export type RequetesEnregistrees = (typeof client.infer)["[GET]/requetes"];

export type Filters = FiltersFormation | FiltersEtablissement;

export type FiltersList = FiltersListFormation | FiltersListEtablissement;
