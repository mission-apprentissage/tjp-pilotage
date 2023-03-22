import { NotionAPI } from "notion-client";

import { Doc } from "@/app/components/NotionDoc";

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "Documentation-V0-Orion-32a009e0dabe48e890893f789162a451"
  );
  return recordMap;
};

export default async function Home() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} />;
}
