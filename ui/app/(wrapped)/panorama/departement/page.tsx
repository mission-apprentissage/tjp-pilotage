import { client } from "@/api.client";

import { PanoramaSelection } from "./PanoramaSelection";

export const revalidate = 0;

export default async function Panorama() {
  const departementsOptions = await client.ref("[GET]/departements").query({});
  return <PanoramaSelection departementsOptions={departementsOptions} />;
}
