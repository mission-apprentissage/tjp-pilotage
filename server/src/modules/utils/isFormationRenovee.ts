import type { ExpressionBuilder} from 'kysely';
import {sql} from 'kysely';
import { CURRENT_RENTREE } from 'shared';
import {getDateRentreeScolaire} from 'shared/utils/getRentreeScolaire';

import type {DB} from '@/db/db';

export const isFormationRenovee = (
  {
    eb,
    rentreeScolaire = CURRENT_RENTREE
  } :
  {
    eb: ExpressionBuilder<DB, "dataFormation">,
    rentreeScolaire?: string
  }) =>
  eb
    .selectFrom("formationHistorique")
    .innerJoin("formationView as fva", "fva.cfd", "formationHistorique.ancienCFD")
    .select("formationHistorique.ancienCFD")
    .where(wb => wb.and([
      wb(wb.ref("formationHistorique.cfd"), "=", wb.ref("dataFormation.cfd")),
      wb("fva.dateFermeture", "is not", null),
      wb("fva.dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(rentreeScolaire)}`)
    ]))
    .limit(1);
