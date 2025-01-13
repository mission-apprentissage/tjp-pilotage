import "./style.css";

import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Ressources-Orion-0301e1e1f6564089a4a05e1e7bd3982a");
  return recordMap;
};

export default async function Ressources() {
  const recordMap = await fetchData();
  return <Doc recordMap={recordMap} pageTitle={"Ressources - Orion"}/>;
}
