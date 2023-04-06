import { dependencies } from "./dependencies";

const getFormationsFactory =
  ({ requestFormations = dependencies.requestFormations }) =>
  async ({ offset, limit }: { offset?: number; limit?: number }) => {
    return await requestFormations({ offset, limit });
  };

export const getFormations = getFormationsFactory({});
