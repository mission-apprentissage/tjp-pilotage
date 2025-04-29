import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";
import type {DemandeStatutTypeWithoutSupprimee} from 'shared/enum/demandeStatutEnum';
import type {TypeDemandeType} from 'shared/enum/demandeTypeEnum';

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getDemandeWithMetadata = async (id: string) => {
  const demande = await getKbdClient()
    .selectFrom("demande")
    .selectAll("demande")
    .select((eb) => [
      jsonBuildObject({
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "demande.uai")
            .limit(1)
        ),
        formation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
            .select((eb) => [
              sql<string>`CONCAT(
                ${eb.ref("dataFormation.libelleFormation")},
                ' (',
                ${eb.ref("niveauDiplome.libelleNiveauDiplome")},
                ')',
                ' (',
                ${eb.ref("dataFormation.cfd")},
                ')'
              )`.as("libelleFormation"),
              sql<boolean>`${eb("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"])}`.as("isFCIL"),
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .leftJoin("rawData", (join) =>
                    join
                      .onRef(sql`"data"->>'DISPOSITIF_FORMATION'`, "=", "dispositif.codeDispositif")
                      .on("rawData.type", "=", "nMef")
                  )
                  .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "dataFormation.cfd")
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            ])
            .whereRef("dataFormation.cfd", "=", "demande.cfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .$narrowType<{
      statut: DemandeStatutTypeWithoutSupprimee,
      typeDemande: TypeDemandeType
    }>()
    .where("demande.id", "=", id)
    .executeTakeFirstOrThrow()
    .then(cleanNull);

  const codeDispositif =
    demande?.codeDispositif &&
    demande.metadata.formation?.dispositifs.find((item) => item.codeDispositif === demande?.codeDispositif)
      ?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      metadata: cleanNull({
        ...demande.metadata,
        formation: cleanNull(demande.metadata.formation),
        etablissement: cleanNull(demande.metadata.etablissement),
      }),
      createdAt: demande.createdAt?.toISOString(),
      codeDispositif,
    })
  );
};
