import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { NFormationDiplomeLine } from "@/modules/import/fileTypes/NFormationDiplome";
import type { NGroupeFormation } from "@/modules/import/fileTypes/NGroupeFormation";
import type { NLienFormationGroupe } from "@/modules/import/fileTypes/NLienFormationGroupe";
import type { NTypeGroupeFormation } from "@/modules/import/fileTypes/NTypeGroupeFormation";


const createFamillesMetiersBcn = async (famillesMetier: Insertable<DB["familleMetier"]>) =>
  getKbdClient()
    .insertInto("familleMetier")
    .values(famillesMetier)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(famillesMetier))
    .execute();

const findNatureCfd = async({ cfd } : { cfd : string }) => {

  const nature = await getKbdClient()
    .selectFrom("rawData")
    .selectAll()
    .where("type", "=", `nFormationDiplome_`)
    .where("data", "@>", {
      "FORMATION_DIPLOME": cfd,
    })
    .executeTakeFirst();

  const typedNature = nature as { data: NFormationDiplomeLine } | undefined;

  return typedNature?.data.NATURE_FORMATION_DIPLOME;
};

const updateCfdFamille = async({ cfd, groupe } : { cfd : string, groupe: string}) => {

  return await getKbdClient()
    .updateTable("familleMetier")
    .set({ cfdFamille: cfd })
    .where("groupe", "=", groupe)
    .execute();
};

const getCfdLienFormationGroupe = async() => {

  const lienFormationGroupe = (await getKbdClient()
    .selectFrom("rawData")
    .selectAll("rawData")
    .where("type", "=", "n_lien_formation_groupe_")
    .execute()
  ).map((item) => item.data as NLienFormationGroupe);

  const cfdUniques = [...new Set(lienFormationGroupe.map(item => item["FORMATION_DIPLOME"]))];

  return cfdUniques;
};

const findGroupe = async ({ cfd }: { cfd: string }) => {

  const groupe = await getKbdClient()
    .selectFrom("rawData")
    .selectAll()
    .where("type", "=", `n_lien_formation_groupe_`)
    .where("data", "@>", {
      "FORMATION_DIPLOME": cfd,
    })
    .executeTakeFirst();

  const typedGroupe = groupe as { data: NGroupeFormation } | undefined;
  return typedGroupe?.data.GROUPE_FORMATION;

};

const findLibelleGroupe = async ({ cfd }: { cfd: string }) => {

  const groupe = await findGroupe({cfd}) || "";

  const libelleGroupe = await getKbdClient()
    .selectFrom("rawData")
    .selectAll()
    .where("type", "=", `n_groupe_formation_`)
    .where("data", "@>", {
      "GROUPE_FORMATION": groupe,
    })
    .executeTakeFirst();
  const typedLibelleGroupe = libelleGroupe as { data: NGroupeFormation } | undefined;
  return typedLibelleGroupe?.data.LIBELLE_EDITION;
};

const findTypeGroupe = async ({ groupe }: { groupe: string }) => {

  const typeGroupe = await getKbdClient()
    .selectFrom("rawData")
    .selectAll()
    .where("type", "=", `n_groupe_formation_`)
    .where("data", "@>", {
      "GROUPE_FORMATION": groupe,
    })
    .executeTakeFirst();

  const typedTypeGroupe = typeGroupe as { data: NGroupeFormation } | undefined;
  return typedTypeGroupe?.data.TYPE_GROUPE_FORMATION;

};

const findLibelleTypeGroupe = async ({ groupe }: { groupe: string }) => {

  const typeGroupe = await findTypeGroupe({groupe});

  if(!typeGroupe){

    return undefined;

  } else {

    const libelleTypeGroupe = await getKbdClient()
      .selectFrom("rawData")
      .selectAll()
      .where("type", "=", `n_type_groupe_formation_`)
      .where("data", "@>", {
        "TYPE_GROUPE_FORMATION": typeGroupe,
      })
      .executeTakeFirst();

    const typedLibelleTypeGroupe = libelleTypeGroupe as { data: NTypeGroupeFormation } | undefined;
    return typedLibelleTypeGroupe?.data.LIBELLE_EDITION;

  }
};

export const importFamillesMetiersDepsBcn = {
  getCfdLienFormationGroupe,
  updateCfdFamille,
  findNatureCfd,
  createFamillesMetiersBcn,
  findGroupe,
  findLibelleGroupe,
  findTypeGroupe,
  findLibelleTypeGroupe
};


