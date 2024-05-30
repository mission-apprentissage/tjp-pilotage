import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findDomaineProfessionnelQuery = async ({
  search,
}: {
  search: string;
}) => {
  const normalizedSearch =
    search?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";

  const domainesProfessionels = await kdb
    .selectFrom("domaineProfessionnel")
    .select([
      "domaineProfessionnel.codeDomaineProfessionnel as value",
      "domaineProfessionnel.libelleDomaineProfessionnel as label",
    ])
    .where((eb) =>
      eb.and([
        eb("domaineProfessionnel.codeDomaineProfessionnel", "is not", null),
        eb("domaineProfessionnel.libelleDomaineProfessionnel", "is not", null),
      ])
    )
    .$castTo<{ value: string; label: string }>()
    .where(
      (eb) =>
        sql`unaccent(${eb.ref(
          "domaineProfessionnel.libelleDomaineProfessionnel"
        )})`,
      "ilike",
      `%${normalizedSearch}%`
    )
    .limit(20)
    .execute();

  return domainesProfessionels.map(cleanNull);
};
