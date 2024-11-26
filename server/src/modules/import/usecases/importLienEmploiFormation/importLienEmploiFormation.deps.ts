import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

const createDomaineProfessionnel = async (domaineProfessionnel: Insertable<DB["domaineProfessionnel"]>) => {
  return getKbdClient()
    .insertInto("domaineProfessionnel")
    .values(domaineProfessionnel)
    .onConflict((oc) => oc.column("codeDomaineProfessionnel").doUpdateSet(domaineProfessionnel))
    .execute();
};

const deleteDomaineProfessionnel = async () => {
  return getKbdClient().deleteFrom("domaineProfessionnel").execute();
};

const createRome = async (rome: Insertable<DB["rome"]>) => {
  return getKbdClient()
    .insertInto("rome")
    .values(rome)
    .onConflict((oc) => oc.column("codeRome").doUpdateSet(rome))
    .execute();
};

const deleteRome = async () => {
  return getKbdClient().deleteFrom("rome").execute();
};

const createMetier = async (data: Insertable<DB["metier"]>) => {
  return getKbdClient()
    .insertInto("metier")
    .values(data)
    .onConflict((oc) => oc.column("codeMetier").doUpdateSet(data))
    .execute();
};

const deleteMetier = async () => {
  return getKbdClient().deleteFrom("metier").execute();
};

const selectDiplomeProCfd = async ({ offset = 0, limit }: { offset?: number; limit: number }) => {
  return getKbdClient()
    .selectFrom("diplomeProfessionnel")
    .select("cfd")
    .distinct()
    .offset(offset)
    .limit(limit)
    .orderBy("cfd", "asc")
    .execute();
};

const deleteFormationRome = async () => {
  return getKbdClient().deleteFrom("formationRome").execute();
};

const createFormationRome = async (data: Insertable<DB["formationRome"]>) => {
  return getKbdClient()
    .insertInto("formationRome")
    .values(data)
    .onConflict((oc) => oc.columns(["cfd", "codeRome"]).doUpdateSet(data))
    .execute();
};

export const importLienEmploiFormation = {
  createDomaineProfessionnel,
  createRome,
  createMetier,
  selectDiplomeProCfd,
  createFormationRome,
  deleteDomaineProfessionnel,
  deleteRome,
  deleteMetier,
  deleteFormationRome,
};
