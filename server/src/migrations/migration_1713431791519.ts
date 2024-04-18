import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  // Drop view to enable altering the view column "statut" type
  await db.schema.dropView("latestDemandeView").execute();

  await db.executeQuery(
    sql`
      ALTER TYPE "demandeStatus" RENAME TO "demandeStatut";
      ALTER TABLE "demande" ALTER COLUMN "statut" TYPE "demandeStatut" USING "statut"::text::"demandeStatut";
    `.compile(db)
  );

  await db.schema
    .createView("latestDemandeView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            // @ts-ignore
            .select([
              sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"),
              "numero",
            ])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted")
    )
    .execute();

  await db.schema
    .createTable("demandeExpe")
    .addColumn("numero", "varchar(8)", (c) => c.notNull())
    .addColumn("cfd", "varchar(8)")
    .addColumn("codeDispositif", "varchar(3)")
    .addColumn("uai", "varchar(8)")
    .addColumn("rentreeScolaire", "integer")
    .addColumn("typeDemande", "varchar")
    .addColumn("motif", sql`varchar[]`)
    .addColumn("autreMotif", "varchar")
    .addColumn("coloration", "boolean")
    .addColumn("libelleColoration", "varchar")
    .addColumn("amiCma", "boolean")
    .addColumn("commentaire", "varchar")
    .addColumn("statut", sql`"demandeStatut"`, (c) => c.notNull())
    .addColumn("codeRegion", "varchar(2)", (c) =>
      c.references("region.codeRegion")
    )
    .addColumn("codeAcademie", "varchar(2)", (c) =>
      c.references("academie.codeAcademie")
    )
    .addColumn("createurId", "uuid", (c) => c.notNull())
    .addColumn("createdAt", "timestamptz", (c) =>
      c.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("capaciteScolaire", "integer")
    .addColumn("capaciteScolaireActuelle", "integer")
    .addColumn("capaciteScolaireColoree", "integer")
    .addColumn("capaciteApprentissage", "integer")
    .addColumn("capaciteApprentissageActuelle", "integer")
    .addColumn("capaciteApprentissageColoree", "integer")
    .addColumn("mixte", "boolean")
    .addColumn("updatedAt", "timestamptz", (c) => c.notNull())
    .addColumn("libelleFCIL", "varchar")
    .addColumn("motifRefus", sql`varchar[]`)
    .addColumn("autreMotifRefus", "varchar")
    .addColumn("campagneId", "uuid")
    .addColumn("id", "uuid", (c) => c.defaultTo(db.fn("uuid_generate_v4")))
    .addColumn("numeroHistorique", "varchar(8)")
    .addColumn("amiCmaValide", "boolean")
    .addColumn("amiCmaValideAnnee", "varchar(4)")
    .addColumn("recrutementRH", "boolean")
    .addColumn("nbRecrutementRH", "integer")
    .addColumn("discipline1RecrutementRH", "varchar")
    .addColumn("discipline2RecrutementRH", "varchar")
    .addColumn("reconversionRH", "boolean")
    .addColumn("nbReconversionRH", "integer")
    .addColumn("discipline1ReconversionRH", "varchar")
    .addColumn("discipline2ReconversionRH", "varchar")
    .addColumn("professeurAssocieRH", "boolean")
    .addColumn("nbProfesseurAssocieRH", "integer")
    .addColumn("discipline1ProfesseurAssocieRH", "varchar")
    .addColumn("discipline2ProfesseurAssocieRH", "varchar")
    .addColumn("formationRH", "boolean")
    .addColumn("nbFormationRH", "integer")
    .addColumn("discipline1FormationRH", "varchar")
    .addColumn("discipline2FormationRH", "varchar")
    .addColumn("amiCmaValideEnCours", "boolean")
    .addColumn("partenairesEconomiquesImpliques", "boolean")
    .addColumn("partenaireEconomique1", "varchar")
    .addColumn("partenaireEconomique2", "varchar")
    .addColumn("cmqImplique", "boolean")
    .addColumn("filiereCmq", "varchar")
    .addColumn("nomCmq", "varchar")
    .addColumn("besoinRHPrecisions", "varchar")
    .addColumn("travauxAmenagement", "boolean")
    .addColumn("travauxAmenagementDescription", "varchar")
    .addColumn("travauxAmenagementParEtablissement", "boolean")
    .addColumn("travauxAmenagementReseaux", "boolean")
    .addColumn("travauxAmenagementReseauxDescription", "varchar")
    .addColumn("achatEquipement", "boolean")
    .addColumn("achatEquipementDescription", "varchar")
    .addColumn("coutEquipement", "integer")
    .addColumn("equipementPrecisions", "varchar")
    .addColumn("augmentationCapaciteAccueilHebergement", "boolean")
    .addColumn("augmentationCapaciteAccueilHebergementPlaces", "integer")
    .addColumn("augmentationCapaciteAccueilHebergementPrecisions", "varchar")
    .addColumn("augmentationCapaciteAccueilRestauration", "boolean")
    .addColumn("augmentationCapaciteAccueilRestaurationPlaces", "integer")
    .addColumn("augmentationCapaciteAccueilRestaurationPrecisions", "varchar")
    .execute();

  await db.schema
    .alterTable("demandeExpe")
    .addPrimaryKeyConstraint("demandeExpe_pkey", ["id"])
    .execute();

  await db.schema
    .alterTable("demandeExpe")
    .addForeignKeyConstraint(
      "demandeExpe_campagneId_fk",
      ["campagneId"],
      "campagne",
      ["id"]
    )
    .execute();

  await db.schema
    .alterTable("demandeExpe")
    .addUniqueConstraint("demandeExpe_unique_constraint", [
      "uai",
      "cfd",
      "codeDispositif",
      "rentreeScolaire",
      "libelleFCIL",
    ])
    .execute();

  await db.schema
    .alterTable("demandeExpe")
    .addForeignKeyConstraint("fk_demandeExpe_user", ["createurId"], "user", [
      "id",
    ])
    .execute();

  await db.schema
    .createView("latestDemandeExpeView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demandeExpe" as never)
            // @ts-ignore
            .select([
              sql<number>`max("demandeExpe"."updatedAt")`.as("lastUpdatedAt"),
              "numero",
            ])
            .distinct()
            .groupBy("numero")
            .as("latestDemandesExpe")
        )
        // @ts-ignore
        .leftJoin("demandeExpe", (join) =>
          join
            .onRef("latestDemandesExpe.numero", "=", "demandeExpe.numero")
            .onRef(
              "latestDemandesExpe.lastUpdatedAt",
              "=",
              "demandeExpe.updatedAt"
            )
        )
        // @ts-ignore
        .selectAll("demandeExpe")
        // @ts-ignore
        .where("demandeExpe.statut", "!=", "deleted")
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeExpeView").execute();

  await db.schema.dropTable("demandeExpe").execute();

  // Drop view to enable altering the view column "statut" type
  await db.schema.dropView("latestDemandeView").execute();

  await db.executeQuery(
    sql`
      ALTER TABLE "demande" ALTER COLUMN "statut" TYPE "varchar" USING "statut"::text;
      ALTER TYPE "demandeStatut" RENAME TO "demandeStatus";
    `.compile(db)
  );

  await db.schema
    .createView("latestDemandeView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            // @ts-ignore
            .select([
              sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"),
              "numero",
            ])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted")
    )
    .execute();
};
