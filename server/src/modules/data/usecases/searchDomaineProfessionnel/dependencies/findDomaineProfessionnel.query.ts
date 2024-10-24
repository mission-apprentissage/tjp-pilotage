import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { getNormalizedSearch } from "../../../../utils/normalizeSearch";

export const findDomaineProfessionnelQuery = async ({
  search,
  limit = 100,
}: {
  search: string;
  limit?: number;
}) => {
  const normalizedSearch = getNormalizedSearch(search);

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
    .orderBy("domaineProfessionnel.libelleDomaineProfessionnel asc")
    .limit(limit)
    .execute();

  return domainesProfessionels.map(cleanNull);
};
