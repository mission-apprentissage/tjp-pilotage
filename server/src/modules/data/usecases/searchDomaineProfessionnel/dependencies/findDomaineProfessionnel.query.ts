import { sql } from "kysely";
import type { OptionType } from "shared/schema/optionSchema";

import { getKbdClient } from "@/db/db";
import { getNormalizedSearch } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const findDomaineProfessionnelQuery = async ({ search, limit = 100 }: { search: string; limit?: number }) => {
  const normalizedSearch = getNormalizedSearch(search);

  const domainesProfessionels = await getKbdClient()
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
    .$castTo<OptionType>()
    .where(
      (eb) => sql`unaccent(${eb.ref("domaineProfessionnel.libelleDomaineProfessionnel")})`,
      "ilike",
      `%${normalizedSearch}%`
    )
    .orderBy("domaineProfessionnel.libelleDomaineProfessionnel asc")
    .limit(limit)
    .execute();

  return domainesProfessionels.map(cleanNull);
};
