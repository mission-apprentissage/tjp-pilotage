import { serverApi } from "@/api.client";
import { PanoramaSelection } from "@/app/(wrapped)/panorama/region/PanoramaSelection";

export const revalidate = 0;

export default async function Panorama() {
  const regionOptions = await serverApi.getRegions({}).call();
  return <PanoramaSelection regionOptions={regionOptions} />;
}
