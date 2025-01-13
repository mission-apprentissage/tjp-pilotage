import { NotionAPI } from "notion-client";

import { Doc } from "@/app/_components/NotionDoc";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("Conditions-G-n-rales-d-Utilisation-new-fb5e055b1884443f91b23fa73e318d88");
  return recordMap;
};

export default async function CGU() {
  const recordMap = await fetchData();
  return <Doc
    recordMap={recordMap}
    pageTitle={
      "Conditions Générales d'Utilisation - Orion"
    }
  />;
}
