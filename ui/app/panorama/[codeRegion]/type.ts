import { api } from "@/api.client";

export type PanoramaStats = Awaited<
  ReturnType<ReturnType<typeof api.getDataForPanorama>["call"]>
>["stats"];

export type PanoramaFormations = Awaited<
  ReturnType<ReturnType<typeof api.getDataForPanorama>["call"]>
>["formations"];

export type PanoramaFormation = Awaited<
  ReturnType<ReturnType<typeof api.getDataForPanorama>["call"]>
>["formations"][number];
