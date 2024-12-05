import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";
import { LandingFooter } from "@/app/(wrapped)/components/LandingFooter";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Statistiques-V2-df324f5721bd4840a6ae571f1e3999f0");
  return recordMap;
};

export default async function Statistiques() {
  const recordMap = await fetchData();
  return (
    <>
      <Doc recordMap={recordMap} />
      <LandingFooter />
    </>
  );
}
