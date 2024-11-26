import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";
import { LandingFooter } from "@/app/(wrapped)/components/LandingFooter";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Statistiques-15053dcb357c49a6bdd1b71053def2aa");
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
