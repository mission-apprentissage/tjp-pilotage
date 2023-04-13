import { dependencies } from "./dependencies";

const getFormationsFactory =
  ({ findFormationsInDb = dependencies.findFormationsInDb }) =>
  async ({
    offset,
    limit,
    codeRegion,
    cfd,
    orderBy,
  }: {
    offset?: number;
    limit?: number;
    codeRegion?: string;
    cfd?: string;
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    return await findFormationsInDb({
      offset,
      limit,
      codeRegion,
      cfd,
      orderBy,
    });
  };

export const getFormations = getFormationsFactory({});
