import type { client } from "@/api.client";

export type Corrections = (typeof client.infer)["[GET]/corrections"];

export type FiltersCorrections = (typeof client.inferArgs)["[GET]/corrections"]["query"];

export type OrderCorrections = Pick<FiltersCorrections, "order" | "orderBy">;

export type CorrectionsStats = (typeof client.infer)["[GET]/corrections"]["stats"];
