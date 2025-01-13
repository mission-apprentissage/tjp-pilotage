import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Politique-de-confidentialit-10dd0d8ec01580bfbf03f5736c07fc44?pvs=4");
  return recordMap;
};

export default async function PolitiqueDeConfidentialite() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} pageTitle={"Politique de confidentialité - Orion"}/>;
}
