// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { findDomaineProfessionnelQuery } from "./dependencies/findDomaineProfessionnel.query";

export const [searchDomaineProfessionnel] = inject(
  { findDomaineProfessionnelQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const nsf = await deps.findDomaineProfessionnelQuery({
        search,
      });
      return nsf;
    }
);
