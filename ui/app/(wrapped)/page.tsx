import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "Documentation-d-Orion-999f316583e9445191d4f62c37027c86"
  );
  return recordMap;
};

export default async function Home() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} />;
}
