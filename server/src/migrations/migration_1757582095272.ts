import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {

  //supprimer le contenu entier de la table familleMetier
  //supprimer le contenu du champ dataFormation.typeFamille
  //ajouter 2 colonnes :
  //groupe varchar(5) qui remplacera (peut-être) le cfdFamille
  //typeGroupe varchar(200) qui sera un libellé directement


};

export const down = async (db: Kysely<unknown>) => {

  //remplir la table familleMetier avec les anciens fichiers
  //remettre le contenu du champ dataFormation.typeFamille
  //supprimer (s'ils existent) les 2 champs groupe et typeGroupe

};

