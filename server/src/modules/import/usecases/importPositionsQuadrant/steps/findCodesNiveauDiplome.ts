import { getKbdClient } from "@/db/db";

export const findCodesNiveauDiplome = async () =>
  await getKbdClient().selectFrom("formationScolaireView").distinct().select(["codeNiveauDiplome"]).execute();
