import { client } from "@/api.client";

export type DomaineDeFormationFilters =
  (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"]["filters"];
export type DomaineDeFormationResult =
  (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"];

export type NsfOptions = (typeof client.infer)["[GET]/domaine-de-formation"];
export type NsfOption = NsfOptions[number];
