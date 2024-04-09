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

export const importLienEmploiFormation = {
  createDomaineProfessionnel,
};
