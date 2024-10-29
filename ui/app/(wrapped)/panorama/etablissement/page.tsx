import { PanoramaSelection } from "./PanoramaSelection";

export const revalidate = 0;

export default async function Panorama({ searchParams }: { searchParams: { wrongUai?: string } }) {
  return <PanoramaSelection wrongUai={searchParams.wrongUai} />;
}
