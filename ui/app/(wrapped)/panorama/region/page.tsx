import { client } from "@/api.client";

import { PanoramaSelection } from "./PanoramaSelection";

export const revalidate = 0;

export default async function Panorama() {
  const regionOptions = await client.ref("[GET]/regions").query({});
  return <PanoramaSelection regionOptions={regionOptions} />;
}
