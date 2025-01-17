import { NotionAPI } from "notion-client";

import { Doc } from "@/components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Mentions-l-gales-2ba4934ec113453e9e66fd5b2cf895df");
  return recordMap;
};

export default async function MentionsLegales() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} pageTitle={"Mentions légales - Orion"}/>;
}
