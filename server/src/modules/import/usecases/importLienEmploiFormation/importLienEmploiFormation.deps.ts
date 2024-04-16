import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

const createDomaineProfessionnel = async (
  domaineProfessionnel: Insertable<DB["domaineProfessionnel"]>
) => {
  return kdb
    .insertInto("domaineProfessionnel")
    .values(domaineProfessionnel)
    .onConflict((oc) =>
      oc.column("codeDomaineProfessionnel").doUpdateSet(domaineProfessionnel)
    )
    .execute();
};

const createRome = async (rome: Insertable<DB["rome"]>) => {
  return kdb
    .insertInto("rome")
    .values(rome)
    .onConflict((oc) => oc.column("codeRome").doUpdateSet(rome))
    .execute();
};

const createMetier = async (data: Insertable<DB["metier"]>) => {
  return kdb
    .insertInto("metier")
    .values(data)
    .onConflict((oc) => oc.column("codeMetier").doUpdateSet(data))
    .execute();
};

const selectDataFormationCfd = async ({ offset = 0 }: { offset?: number }) => {
  return kdb
    .selectFrom("dataFormation")
    .select(["cfd"])
    .offset(offset)
    .orderBy("cfd", "asc")
    .execute();
};

const createFormationRome = async (data: Insertable<DB["formationRome"]>) => {
  return kdb
    .insertInto("formationRome")
    .values(data)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(data))
    .execute();
};

export const importLienEmploiFormation = {
  createDomaineProfessionnel,
  createRome,
  createMetier,
  selectDataFormationCfd,
  createFormationRome,
};
