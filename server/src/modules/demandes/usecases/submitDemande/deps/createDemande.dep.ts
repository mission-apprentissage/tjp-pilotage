import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { updateDemandeWithHistory } from "@/modules/demandes/repositories/updateDemandeWithHistory.query";

export const createDemandeQuery = async (demande: Insertable<DB["demande"]>) =>
  updateDemandeWithHistory(demande);

