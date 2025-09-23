import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";

// DIFFÉRENCES CAPACITÉS

export const countDifferenceCapacitePlacesOuvertes = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countDifferenceCapacitePlacesOuvertesScolaire({ eb })} +
    ${countDifferenceCapacitePlacesOuvertesApprentissage({ eb })}
  `;

export const countDifferenceCapacitePlacesOuvertesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteScolaire({ eb })} > 0`)
    .then(countDifferenceCapaciteScolaire({ eb }))
    .else(0)
    .end();

export const countDifferenceCapacitePlacesOuvertesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteApprentissage({ eb })} > 0`)
    .then(countDifferenceCapaciteApprentissage({ eb }))
    .else(0)
    .end();

export const countDifferenceCapacitePlacesFermees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countDifferenceCapacitePlacesFermeesScolaire({ eb })} +
    ${countDifferenceCapacitePlacesFermeesApprentissage({ eb })}
  `;

export const countDifferenceCapacitePlacesFermeesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteScolaire({ eb })} < 0`)
    .then(sql<number>`ABS(${countDifferenceCapaciteScolaire({ eb })})`)
    .else(0)
    .end();

export const countDifferenceCapacitePlacesFermeesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteApprentissage({ eb })} < 0`)
    .then(sql<number>`ABS(${countDifferenceCapaciteApprentissage({ eb })})`)
    .else(0)
    .end();

export const countDifferenceCapacitePlacesOuvertesColorees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countDifferenceCapacitePlacesOuvertesColoreesScolaire({ eb })} +
    ${countDifferenceCapacitePlacesOuvertesColoreesApprentissage({ eb })}
  `;

export const countDifferenceCapacitePlacesOuvertesColoreesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteScolaireColoree({ eb })} > 0`)
    .then(countDifferenceCapaciteScolaireColoree({ eb }))
    .else(0)
    .end();

export const countDifferenceCapacitePlacesOuvertesColoreesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteApprentissageColoree({ eb })} > 0`)
    .then(countDifferenceCapaciteApprentissageColoree({ eb }))
    .else(0)
    .end();

export const countDifferenceCapacitePlacesFermeesColorees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countDifferenceCapacitePlacesFermeesColoreesScolaire({ eb })} +
    ${countDifferenceCapacitePlacesFermeesColoreesApprentissage({ eb })}
  `;

export const countDifferenceCapacitePlacesFermeesColoreesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteScolaireColoree({ eb })} < 0`)
    .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree({ eb })})`)
    .else(0)
    .end();

export const countDifferenceCapacitePlacesFermeesColoreesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    .when(sql<number>`${countDifferenceCapaciteApprentissageColoree({ eb })} < 0`)
    .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree({ eb })})`)
    .else(0)
    .end();

export const countDifferenceCapaciteScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")}
  `;

export const countDifferenceCapaciteScolaireColoree = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${eb.ref("demande.capaciteScolaireColoree")} -
    ${eb.ref("demande.capaciteScolaireColoreeActuelle")}
  `;

export const countDifferenceCapaciteScolaireCorrection = ({ eb }: { eb: ExpressionBuilder<DB, "correction"> }) =>
  sql<number>`
    ${eb.ref("correction.capaciteScolaire")} -
    ${eb.ref("correction.capaciteScolaireActuelle")}
  `;

export const countDifferenceCapaciteApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
      ${eb.ref("demande.capaciteApprentissage")} -
      ${eb.ref("demande.capaciteApprentissageActuelle")}
    `;

export const countDifferenceCapaciteApprentissageColoree = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${eb.ref("demande.capaciteApprentissageColoree")} -
    ${eb.ref("demande.capaciteApprentissageColoreeActuelle")}
  `;

export const countDifferenceCapaciteApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
    ${eb.ref("correction.capaciteApprentissage")} -
    ${eb.ref("correction.capaciteApprentissageActuelle")}
  `;
