import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "Conditions-G-n-rales-d-Utilisation-3bea017c99e04251b702f32658103d79?pvs=4"
  );
  return recordMap;
};

export default async function CGU() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} />;
}
