import { NotionAPI } from "notion-client";

import { GuardPermission } from "@/utils/security/GuardPermission";

import { DocumentationClient } from "./page.client";

export const revalidate = 60;

const fetchData = async () => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "Enregistrer-une-demande-d-ouverture-ou-de-fermeture-dans-Orion-aa580451c49b4e548bb545829de227d4?pvs=4",
  );
  return recordMap;
};

export default async function Documentation() {
  const recordMap = await fetchData();
  return (
    <GuardPermission permission="intentions/lecture">
      <DocumentationClient recordMap={recordMap} />
    </GuardPermission>
  );
}
