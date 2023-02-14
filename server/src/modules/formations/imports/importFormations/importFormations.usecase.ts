import fs from "fs";
import { DateTime } from "luxon";

import { DiplomeProfessionnelLine } from "../../files/DiplomesProfessionnels";
import { NFormationDiplomeLine } from "../../files/NFormationDiplome";
import { parseSync } from "../../utils/parseSync";
import { createFormation as createFormationDep } from "./createFormation";

const CFDOverride: Record<string, string> = {
  "Brevet professionnel_Tailleur de pierres monuments historiques": "45023201",
  "Baccalauréat professionnel_Technicien en réalisation de produits mécaniques, option Réalisation et maintenance des outillages":
    "40025013",
  "Baccalauréat professionnel_Technicien en réalisation de produits mécaniques option réalisation et suivi de production":
    "40025014",
  "Baccalauréat professionnel_Métiers de l'entretien des textiles, option A : blanchisserie":
    "40024005",
  "Baccalauréat professionnel_Métiers de l'entretien des textiles, option B : pressing":
    "40024006",
};

const RNCPOverride: Record<string, string> = {
  "Certificat d'aptitude professionnelle_Métiers de l’entretien des textiles, option B : pressing":
    "35808",
  "Certificat d'aptitude professionnelle_Peintre applicateur de revêtements":
    "35196",
  "Brevet de technicien supérieur_Collaborateur juriste notarial": "36685",
  "Brevet de technicien supérieur_Commerce international": "35800",
  "Brevet de technicien supérieur_Conseil et commercialisation de solutions techniques":
    "35801",
  "Certificat d'aptitude professionnelle_Menuisier fabricant": "36112",
};

const formatCFD = (line: DiplomeProfessionnelLine) => {
  const cfdOverride =
    CFDOverride[
      `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
    ];
  if (cfdOverride) return cfdOverride;

  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);
  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

const formatRNCP = (line: DiplomeProfessionnelLine) => {
  const rncpOverride =
    RNCPOverride[
      `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
    ];
  if (rncpOverride) return rncpOverride;

  if (!line["Code RNCP"]) return;
  if (isNaN(parseInt(line["Code RNCP"]))) return;
  return line["Code RNCP"];
};

export const importFormationsFactory =
  () =>
  async ({
    diplomesProfessionnelsContent = fs.readFileSync(
      `${__dirname}/../../files/diplomesProfessionnels.csv`,
      "utf8"
    ),
    nFormationDiplome_Content = fs.readFileSync(
      `${__dirname}/../../files/nFormationDiplome_.csv`,
      "utf8"
    ),
    createFormation = createFormationDep,
  } = {}) => {
    console.log(`Import des formations`);
    const diplomesProfessionnels: DiplomeProfessionnelLine[] = parseSync(
      diplomesProfessionnelsContent
    );

    const nFormationDiplomes: Record<string, NFormationDiplomeLine> = (
      parseSync(nFormationDiplome_Content) as NFormationDiplomeLine[]
    ).reduce((acc, cur) => ({ ...acc, [cur.FORMATION_DIPLOME]: cur }), {});

    const formations = diplomesProfessionnels
      .map((value) => ({
        ...value,
        "Code diplôme": formatCFD(value),
        "Code RNCP": formatRNCP(value),
      }))
      .filter(
        (
          value
        ): value is Required<
          Pick<DiplomeProfessionnelLine, "Code diplôme" | "Code RNCP">
        > &
          DiplomeProfessionnelLine =>
          !!(value["Code diplôme"] && value["Code RNCP"])
      )
      .filter((value) => !!nFormationDiplomes[value["Code diplôme"]])
      .map((value) => ({
        ...value,
        ...nFormationDiplomes[value["Code diplôme"]],
      }))
      .map((value) => ({
        codeFormationDiplome: value["Code diplôme"],
        rncp: parseInt(value["Code RNCP"]),
        libelleDiplome: value["Intitulé de la spécialité (et options)"],
        codeNiveauDiplome: value["Code diplôme"].slice(0, 3),
        dateOuverture: DateTime.fromFormat(
          value.DATE_OUVERTURE,
          "dd/LL/yyyy"
        ).toJSDate(),
        dateFermeture: value.DATE_FERMETURE
          ? DateTime.fromFormat(value.DATE_FERMETURE, "dd/LL/yyyy").toJSDate()
          : undefined,
      }));

    console.log(
      `${formations.length} formations vont être ajoutées ou mises à jour`
    );

    await createFormation(formations);

    console.log(`${formations.length} formations ajoutées ou mises à jour`);
  };

export const importFormations = importFormationsFactory();
