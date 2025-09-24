import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {

  //await viderFamilleMetier(db);

  //supprimer le contenu entier de la table familleMetier
  await db.executeQuery(sql`TRUNCATE TABLE "familleMetier";`.compile(db));

  //supprimer le contenu du champ dataFormation.typeFamille
  await db.executeQuery(sql`UPDATE "dataFormation" SET "typeFamille" = null WHERE true;`.compile(db));

  //2 nouvelles colonnes:
  //"groupe" varchar(5) qui pourra remplacer le cfdFamille
  //"typeGroupe" varchar(200) qui sera un libellé directement
  await db.schema
    .alterTable("familleMetier")
    .addColumn("groupe", sql`varchar(5)`)
    .addColumn("typeGroupe", sql`varchar(200)`)
    .execute();

  //supprimer la colonne codeMinistereTutelle
  await db.schema
    .alterTable("familleMetier")
    .dropColumn("codeMinistereTutelle")
    .execute();

  //Alimenter la table avec la BCN:
  //yarn cli importTables importFamillesMetiersBcn && yarn cli importTables importDataFormations


};

export const down = async (db: Kysely<unknown>) => {

  //await viderFamilleMetier(db);

  //Suppression des 2 nouveaux champs
  await db.schema
    .alterTable("familleMetier")
    .dropColumn("groupe")
    .dropColumn("typeGroupe")
    .execute();

  //Rajout de la colonne codeMinistereTutelle
  await db.schema
    .alterTable("familleMetier")
    .addColumn("codeMinistereTutelle", sql`varchar(2)`)
    .execute();

  //Alimenter la table avec l'ancien fichier:
  //yarn cli importTables importFamillesMetiers && yarn cli importTables importDataFormations

};

const viderFamilleMetier = async (db: Kysely<unknown>) => {

  //supprimer le contenu entier de la table familleMetier
  await db.executeQuery(sql`TRUNCATE TABLE "familleMetier";`.compile(db));

  //supprimer le contenu du champ dataFormation.typeFamille
  await db.executeQuery(sql`UPDATE "dataFormation" SET "typeFamille" = null WHERE true;`.compile(db));

};

