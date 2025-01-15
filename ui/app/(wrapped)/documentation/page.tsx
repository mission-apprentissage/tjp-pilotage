import { NotionAPI } from "notion-client";

import { Doc } from "@/components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Documentation-V0-Orion-32a009e0dabe48e890893f789162a451");
  return recordMap;
};

export default async function Documentation() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} />;
}
