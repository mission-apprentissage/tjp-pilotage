import { api } from "@/api.client";

export type PanoramaFormations = Awaited<
  ReturnType<ReturnType<typeof api.getDataForPanorama>["call"]>
>["formations"];

export type PanoramaFormation = Awaited<
  ReturnType<ReturnType<typeof api.getDataForPanorama>["call"]>
>["formations"][number];
