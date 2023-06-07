import { serverApi } from "@/api.client";
import { PanoramaSelection } from "@/app/panorama/PanoramaSelection";

export default async function Panorama() {
  const regionOptions = await serverApi.getRegions({}).call();
  return <PanoramaSelection regionOptions={regionOptions} />;
}
