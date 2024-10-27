/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.executeQuery(
    sql`
    CREATE EXTENSION "uuid-ossp"
    SCHEMA "public"
    VERSION "1.1";

    CREATE EXTENSION pg_trgm
    SCHEMA "public"
    VERSION "1.6";

    CREATE EXTENSION btree_gin
    SCHEMA "public"
    VERSION "1.3";

    CREATE TABLE public."familleMetier" (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      "libelleOfficielFamille" varchar NOT NULL,
      "libelleOfficielSpecialite" varchar NOT NULL,
      "codeMinistereTutelle" varchar(2) NOT NULL,
      "mefStat11Famille" varchar NOT NULL,
      "mefStat11Specialite" varchar NOT NULL,
      "cfdFamille" varchar(8) NOT NULL,
      "cfdSpecialite" varchar(8) NOT NULL,
      CONSTRAINT "familleMetier_mefStat11Specialite_key" UNIQUE ("mefStat11Specialite"),
      CONSTRAINT "familleMetier_pkey" PRIMARY KEY (id)
    );
       
    CREATE TABLE public."niveauDiplome" (
      "codeNiveauDiplome" varchar(3) NOT NULL,
      "libelleNiveauDiplome" varchar(300) NULL,
      CONSTRAINT "niveauDiplome_pkey" PRIMARY KEY ("codeNiveauDiplome")
    );
        
    CREATE TABLE public."rawData" (
      "type" varchar NOT NULL,
      "data" jsonb NULL,
      id uuid NULL DEFAULT uuid_generate_v4()
    );
    CREATE INDEX "rawData_gin_data" ON public."rawData" USING gin (data);
    CREATE INDEX "rawData_gin_data_muaa" ON public."rawData" USING gin (type, id, data);
    CREATE INDEX rawdata_id_idx ON public."rawData" USING btree (id);
    CREATE INDEX rawdata_type_idx ON public."rawData" USING btree (type);
    
    CREATE TABLE public.region (
      "codeRegion" varchar(2) NOT NULL,
      "libelleRegion" varchar NOT NULL,
      CONSTRAINT "region_libelleRegion_key" UNIQUE ("libelleRegion"),
      CONSTRAINT region_pkey PRIMARY KEY ("codeRegion")
    );
    
    CREATE TABLE public.academie (
      "codeAcademie" varchar(2) NOT NULL,
      libelle varchar NOT NULL,
      "codeRegion" varchar(2) NOT NULL,
      CONSTRAINT academie_pkey PRIMARY KEY ("codeAcademie"),
      CONSTRAINT fk_academie_region FOREIGN KEY ("codeRegion") REFERENCES region("codeRegion")
    );
    
    CREATE TABLE public.departement (
      "codeDepartement" varchar(3) NOT NULL,
      libelle varchar NOT NULL,
      "codeAcademie" varchar(2) NOT NULL,
      "codeRegion" varchar(2) NOT NULL,
      CONSTRAINT departement_pkey PRIMARY KEY ("codeDepartement"),
      CONSTRAINT fk_departement_academie FOREIGN KEY ("codeAcademie") REFERENCES academie("codeAcademie"),
      CONSTRAINT fk_departement_region FOREIGN KEY ("codeRegion") REFERENCES region("codeRegion")
    );
    
    CREATE TABLE public.dispositif (
      "codeDispositif" varchar(3) NOT NULL,
      "codeNiveauDiplome" varchar(3) NOT NULL,
      "libelleDispositif" varchar(300) NOT NULL,
      CONSTRAINT dispositif_pkey PRIMARY KEY ("codeDispositif"),
      CONSTRAINT fk_dispositif_niveaudiplome FOREIGN KEY ("codeNiveauDiplome") REFERENCES "niveauDiplome"("codeNiveauDiplome")
    );
    
    CREATE TABLE public.etablissement (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      "UAI" varchar(8) NOT NULL,
      siret varchar(14) NULL,
      "codeAcademie" varchar(2) NULL,
      "natureUAI" varchar(3) NULL,
      "libelleEtablissement" varchar(200) NULL,
      "adresseEtablissement" varchar(200) NULL,
      "codePostal" varchar(5) NULL,
      secteur varchar(2) NULL,
      "dateOuverture" date NULL,
      "dateFermeture" date NULL,
      "codeMinistereTutuelle" varchar(2) NULL,
      "codeRegion" varchar(2) NULL,
      "codeDepartement" varchar(3) NULL,
      commune varchar NULL,
      CONSTRAINT "etablissement_UAI_key" UNIQUE ("UAI"),
      CONSTRAINT etablissement_pkey PRIMARY KEY (id),
      CONSTRAINT fk_etablissement_academie FOREIGN KEY ("codeAcademie") REFERENCES academie("codeAcademie"),
      CONSTRAINT fk_etablissement_departement FOREIGN KEY ("codeDepartement") REFERENCES departement("codeDepartement"),
      CONSTRAINT fk_etablissement_region FOREIGN KEY ("codeRegion") REFERENCES region("codeRegion")
    );
    
    CREATE TABLE public.formation (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      "codeFormationDiplome" varchar(8) NOT NULL,
      rncp int4 NULL,
      "libelleDiplome" varchar NOT NULL,
      "codeNiveauDiplome" varchar(3) NOT NULL,
      "dateOuverture" date NOT NULL,
      "dateFermeture" date NULL,
      "CPC" varchar NULL,
      "CPCSecteur" varchar NULL,
      "CPCSousSecteur" varchar NULL,
      "libelleFiliere" varchar NULL,
      CONSTRAINT "formation_codeFormationDiplome_key" UNIQUE ("codeFormationDiplome"),
      CONSTRAINT formation_pkey PRIMARY KEY (id),
      CONSTRAINT fk_formation_niveaudiplome FOREIGN KEY ("codeNiveauDiplome") REFERENCES "niveauDiplome"("codeNiveauDiplome")
    );
    
    CREATE TABLE public."formationEtablissement" (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      cfd varchar(8) NOT NULL,
      "UAI" varchar(8) NOT NULL,
      "dispositifId" varchar(3) NOT NULL,
      voie varchar(20) NOT NULL,
      CONSTRAINT "formationEtablissement_pkey" PRIMARY KEY (id),
      CONSTRAINT formationetablissement_pk UNIQUE (cfd, "UAI", "dispositifId", voie),
      CONSTRAINT fk_etablissement FOREIGN KEY ("UAI") REFERENCES etablissement("UAI"),
      CONSTRAINT fk_etablissement_dispositif FOREIGN KEY ("dispositifId") REFERENCES dispositif("codeDispositif"),
      CONSTRAINT fk_formation FOREIGN KEY (cfd) REFERENCES formation("codeFormationDiplome")
    );
    
    CREATE TABLE public."formationHistorique" (
      "codeFormationDiplome" varchar(8) NOT NULL,
      "ancienCFD" varchar(8) NOT NULL,
      CONSTRAINT formationhistorique_pk PRIMARY KEY ("codeFormationDiplome", "ancienCFD"),
      CONSTRAINT fk_formation FOREIGN KEY ("codeFormationDiplome") REFERENCES formation("codeFormationDiplome"),
      CONSTRAINT fk_formation2 FOREIGN KEY ("ancienCFD") REFERENCES formation("codeFormationDiplome")
    );
    
    CREATE TABLE public."indicateurEntree" (
      "formationEtablissementId" uuid NOT NULL,
      "rentreeScolaire" varchar(4) NOT NULL,
      capacite int4 NULL,
      "effectifEntree" int4 NULL,
      "nbPremiersVoeux" int4 NULL,
      effectifs jsonb NULL,
      "anneeDebut" int4 NULL,
      capacites jsonb NULL,
      "premiersVoeux" jsonb NULL,
      CONSTRAINT indicateurentree_pk PRIMARY KEY ("formationEtablissementId", "rentreeScolaire"),
      CONSTRAINT fk_indicateurentree_formationetablissement FOREIGN KEY ("formationEtablissementId") REFERENCES "formationEtablissement"(id)
    );
    
    CREATE TABLE public."indicateurEtablissement" (
      "UAI" varchar(8) NOT NULL,
      millesime varchar(9) NOT NULL,
      "valeurAjoutee" int4 NULL,
      CONSTRAINT indicateuretablissement_pk PRIMARY KEY ("UAI", millesime),
      CONSTRAINT fk_etablissement FOREIGN KEY ("UAI") REFERENCES etablissement("UAI")
    );
    
    CREATE TABLE public."indicateurSortie" (
      "formationEtablissementId" uuid NOT NULL,
      "millesimeSortie" varchar(9) NOT NULL,
      reussite int4 NULL,
      "effectifSortie" int4 NULL,
      "nbSortants" int4 NULL,
      "nbPoursuiteEtudes" int4 NULL,
      "nbInsertion6mois" int4 NULL,
      "nbInsertion12mois" int4 NULL,
      "nbInsertion24mois" int4 NULL,
      CONSTRAINT indicateursortie_pk PRIMARY KEY ("formationEtablissementId", "millesimeSortie"),
      CONSTRAINT fk_indicateursortie_formationetablissement FOREIGN KEY ("formationEtablissementId") REFERENCES "formationEtablissement"(id)
    );
  `.compile(db)
  );
};
export const down = async () => {};
