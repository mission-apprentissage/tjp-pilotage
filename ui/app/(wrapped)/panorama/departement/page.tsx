import { serverApi } from "@/api.client";

import { PanoramaSelection } from "./PanoramaSelection";

export const revalidate = 0;

export default async function Panorama() {
  const departementsOptions = await serverApi.getDepartements({}).call();
  return <PanoramaSelection departementsOptions={departementsOptions} />;
}
