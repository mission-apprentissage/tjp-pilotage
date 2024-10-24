import { getNsfsAndFormations } from "./dependencies/getNsfsAndFormations";

const getDomainesDeFormationFactory =
  (deps = { getNsfsAndFormations }) =>
  async (search?: string) =>
    deps.getNsfsAndFormations(search);

export const getDomainesDeFormation = getDomainesDeFormationFactory();
