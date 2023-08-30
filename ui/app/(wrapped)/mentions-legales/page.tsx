import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "Mentions-l-gales-fc279d2c008c4ea58e62f2a6a17a2a95"
  );
  return recordMap;
};

export default async function MentionsLegales() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} />;
}
