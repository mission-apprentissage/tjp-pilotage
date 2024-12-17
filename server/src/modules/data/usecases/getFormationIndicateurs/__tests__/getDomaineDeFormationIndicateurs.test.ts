import type { getFormationCfdIndicatorsSchema } from "shared/routes/schemas/get.formation.cfd.indicators.schema";
import { beforeAll, describe, expect, it } from "vitest";
import type { z } from "zod";

import { usePg } from "@/../tests/pg.test.utils";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<(typeof getFormationCfdIndicatorsSchema.response)[200]>;

describe("GET /api/formation/:cfd/indicators", () => {
  const cfd = "40031213";
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  it("doit retourner une erreur 404 si le cfd n'existe pas", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/formation/1234567890/indicators",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "La formation avec le cfd 1234567890 est inconnue",
      name: "Not Found",
      statusCode: 404,
    });
  });

  describe("Nombre d'établissements", () => {
    it("doit retourner le nombre d'établissement nationaux", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.etablissements).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", nbEtablissements: 785 },
          { rentreeScolaire: "2021", nbEtablissements: 797 },
          { rentreeScolaire: "2022", nbEtablissements: 802 },
          { rentreeScolaire: "2023", nbEtablissements: 806 },
        ])
      );
    });

    it("doit retourner le nombre d'établissement regionaux (84)", async () => {
      const codeRegion = "84";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.etablissements).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", nbEtablissements: 89 },
          { rentreeScolaire: "2021", nbEtablissements: 92 },
          { rentreeScolaire: "2022", nbEtablissements: 94 },
          { rentreeScolaire: "2023", nbEtablissements: 95 },
        ])
      );
    });

    it("doit retourner le nombre d'établissement du département (10)", async () => {
      const codeRegion = "84";
      const codeAcademie = "10";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.etablissements).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", nbEtablissements: 36 },
          { rentreeScolaire: "2021", nbEtablissements: 37 },
          { rentreeScolaire: "2022", nbEtablissements: 38 },
          { rentreeScolaire: "2023", nbEtablissements: 39 },
        ])
      );
    });

    it("doit retourner le nombre d'établissement du département (069)", async () => {
      const codeRegion = "84";
      const codeAcademie = "10";
      const codeDepartement = "069";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}&codeDepartement=${codeDepartement}`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.etablissements).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", nbEtablissements: 18 },
          { rentreeScolaire: "2021", nbEtablissements: 18 },
          { rentreeScolaire: "2022", nbEtablissements: 19 },
          { rentreeScolaire: "2023", nbEtablissements: 20 },
        ])
      );
    });
  });

  describe("Effectifs", () => {
    it("doit retourner les effectifs nationaux", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.effectifs).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", effectif: 23361 },
          { rentreeScolaire: "2021", effectif: 22823 },
          { rentreeScolaire: "2022", effectif: 22658 },
          { rentreeScolaire: "2023", effectif: 23268 },
        ])
      );
    });

    it("doit retourner les effectifs regionaux (84)", async () => {
      const codeRegion = "84";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.effectifs).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", effectif: 2001 },
          { rentreeScolaire: "2021", effectif: 2071 },
          { rentreeScolaire: "2022", effectif: 2024 },
          { rentreeScolaire: "2023", effectif: 2088 },
        ])
      );
    });

    it("doit retourner les effectifs regionaux (84) et académie (10)", async () => {
      const codeRegion = "84";
      const codeAcademie = "10";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.effectifs).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", effectif: 752 },
          { rentreeScolaire: "2021", effectif: 776 },
          { rentreeScolaire: "2022", effectif: 819 },
          { rentreeScolaire: "2023", effectif: 827 },
        ])
      );
    });

    it("doit retourner les effectifs regionaux (84) et académie (10) et département (069)", async () => {
      const codeRegion = "84";
      const codeAcademie = "10";
      const codeDepartement = "069";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}&codeDepartement=${codeDepartement}`,
      });

      expect(response.statusCode).toBe(200);
      const result = await response.json<Response>();

      expect(result.effectifs).toEqual(
        expect.arrayContaining([
          { rentreeScolaire: "2020", effectif: 434 },
          { rentreeScolaire: "2021", effectif: 444 },
          { rentreeScolaire: "2022", effectif: 466 },
          { rentreeScolaire: "2023", effectif: 480 },
        ])
      );
    });
  });

  describe("Taux IJ", () => {
    it("doit retourner les taux IJ nationaux", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators`,
      });
      const result = await response.json<Response>();

      expect(result.tauxIJ.tauxPoursuite).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.2967, libelle: "2019+20", scolaire: 0.509 },
          { apprentissage: 0.4036, libelle: "2020+21", scolaire: 0.5379 },
          { apprentissage: 0.3954, libelle: "2021+22", scolaire: 0.5504 },
        ])
      );

      expect(result.tauxIJ.tauxInsertion).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.5937, libelle: "2019+20", scolaire: 0.3496 },
          { apprentissage: 0.6249, libelle: "2020+21", scolaire: 0.3531 },
          { apprentissage: 0.6137, libelle: "2021+22", scolaire: 0.4291 },
        ])
      );

      expect(result.tauxIJ.tauxDevenirFavorable).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.7143, libelle: "2019+20", scolaire: 0.6807 },
          { apprentissage: 0.7755, libelle: "2020+21", scolaire: 0.7011 },
          { apprentissage: 0.7664, libelle: "2021+22", scolaire: 0.7433 },
        ])
      );
    });

    it("doit retourner les taux IJ regionaux (84)", async () => {
      const codeRegion = "84";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}`,
      });
      const result = await response.json<Response>();

      expect(result.tauxIJ.tauxPoursuite).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.2518, libelle: "2019+20", scolaire: 0.5095 },
          { apprentissage: 0.375, libelle: "2020+21", scolaire: 0.5478 },
          { apprentissage: 0.4047, libelle: "2021+22", scolaire: 0.5769 },
        ])
      );

      expect(result.tauxIJ.tauxInsertion).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.6362, libelle: "2019+20", scolaire: 0.4757 },
          { apprentissage: 0.7, libelle: "2020+21", scolaire: 0.468 },
          { apprentissage: 0.6719, libelle: "2021+22", scolaire: 0.4935 },
        ])
      );

      expect(result.tauxIJ.tauxDevenirFavorable).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.7278, libelle: "2019+20", scolaire: 0.7428 },
          { apprentissage: 0.8125, libelle: "2020+21", scolaire: 0.7594 },
          { apprentissage: 0.8047, libelle: "2021+22", scolaire: 0.7857 },
        ])
      );
    });

    it("doit retourner les taux IJ regionaux (84) même si une académie est spécifiée", async () => {
      const codeRegion = "84";
      const codeAcademie = "10";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}`,
      });
      const result = await response.json<Response>();

      expect(result.tauxIJ.tauxPoursuite).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.2518, libelle: "2019+20", scolaire: 0.5095 },
          { apprentissage: 0.375, libelle: "2020+21", scolaire: 0.5478 },
          { apprentissage: 0.4047, libelle: "2021+22", scolaire: 0.5769 },
        ])
      );

      expect(result.tauxIJ.tauxInsertion).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.6362, libelle: "2019+20", scolaire: 0.4757 },
          { apprentissage: 0.7, libelle: "2020+21", scolaire: 0.468 },
          { apprentissage: 0.6719, libelle: "2021+22", scolaire: 0.4935 },
        ])
      );

      expect(result.tauxIJ.tauxDevenirFavorable).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.7278, libelle: "2019+20", scolaire: 0.7428 },
          { apprentissage: 0.8125, libelle: "2020+21", scolaire: 0.7594 },
          { apprentissage: 0.8047, libelle: "2021+22", scolaire: 0.7857 },
        ])
      );
    });

    it("doit retourner les taux IJ regionaux (84) même si un département est spécifié", async () => {
      const codeRegion = "84";
      const codeAcademie = "10";
      const codeDepartement = "069";
      const response = await app.inject({
        method: "GET",
        url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}&codeDepartement=${codeDepartement}`,
      });
      const result = await response.json<Response>();

      expect(result.tauxIJ.tauxPoursuite).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.2518, libelle: "2019+20", scolaire: 0.5095 },
          { apprentissage: 0.375, libelle: "2020+21", scolaire: 0.5478 },
          { apprentissage: 0.4047, libelle: "2021+22", scolaire: 0.5769 },
        ])
      );

      expect(result.tauxIJ.tauxInsertion).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.6362, libelle: "2019+20", scolaire: 0.4757 },
          { apprentissage: 0.7, libelle: "2020+21", scolaire: 0.468 },
          { apprentissage: 0.6719, libelle: "2021+22", scolaire: 0.4935 },
        ])
      );

      expect(result.tauxIJ.tauxDevenirFavorable).toEqual(
        expect.arrayContaining([
          { apprentissage: 0.7278, libelle: "2019+20", scolaire: 0.7428 },
          { apprentissage: 0.8125, libelle: "2020+21", scolaire: 0.7594 },
          { apprentissage: 0.8047, libelle: "2021+22", scolaire: 0.7857 },
        ])
      );
    });
  });

  describe("Taux pression", () => {
    it.each`
      scope            | codeRegion   | codeAcademie | codeDepartement | tauxPression        | rs
      ${"national"}    | ${undefined} | ${undefined} | ${undefined}    | ${1.2097078497513}  | ${"2021"}
      ${"national"}    | ${undefined} | ${undefined} | ${undefined}    | ${1.23653261430784} | ${"2022"}
      ${"national"}    | ${undefined} | ${undefined} | ${undefined}    | ${1.24674508908177} | ${"2023"}
      ${"région"}      | ${"84"}      | ${undefined} | ${undefined}    | ${1.52631578947368} | ${"2021"}
      ${"région"}      | ${"84"}      | ${undefined} | ${undefined}    | ${1.5998322147651}  | ${"2022"}
      ${"région"}      | ${"84"}      | ${undefined} | ${undefined}    | ${1.61234991423671} | ${"2023"}
      ${"académie"}    | ${"84"}      | ${"10"}      | ${undefined}    | ${1.66306695464363} | ${"2021"}
      ${"académie"}    | ${"84"}      | ${"10"}      | ${undefined}    | ${1.69574468085106} | ${"2022"}
      ${"académie"}    | ${"84"}      | ${"10"}      | ${undefined}    | ${1.91121495327103} | ${"2023"}
      ${"département"} | ${"84"}      | ${"10"}      | ${"069"}        | ${1.84677419354839} | ${"2021"}
      ${"département"} | ${"84"}      | ${"10"}      | ${"069"}        | ${1.73977695167286} | ${"2022"}
      ${"département"} | ${"84"}      | ${"10"}      | ${"069"}        | ${1.97619047619048} | ${"2023"}
    `(
      "doit retourner les taux pression $scope pour la rentrée scolaire $rs",
      async ({ scope, codeRegion, codeAcademie, codeDepartement, tauxPression, rs }) => {
        const response = await app.inject({
          method: "GET",
          url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}&codeDepartement=${codeDepartement}`,
        });

        const result = await response.json<Response>();

        console.log(result.tauxPressions);

        const tauxPressionFound = result.tauxPressions.find(
          (tp) => tp.rentreeScolaire === rs && tp.scope === scope && tp.value === tauxPression
        );

        expect(tauxPressionFound).toBeDefined();
      }
    );
  });

  describe("Taux de remplissage", () => {
    it.each`
      scope            | codeRegion   | codeAcademie | codeDepartement | tauxRemplissage      | rs
      ${"national"}    | ${undefined} | ${undefined} | ${undefined}    | ${0.974633596392334} | ${"2021"}
      ${"national"}    | ${undefined} | ${undefined} | ${undefined}    | ${0.977941593422172} | ${"2022"}
      ${"national"}    | ${undefined} | ${undefined} | ${undefined}    | ${0.994687464677292} | ${"2023"}
      ${"région"}      | ${"84"}      | ${undefined} | ${undefined}    | ${1.00417710944027}  | ${"2021"}
      ${"région"}      | ${"84"}      | ${undefined} | ${undefined}    | ${1.08305369127517}  | ${"2022"}
      ${"région"}      | ${"84"}      | ${undefined} | ${undefined}    | ${1.11663807890223}  | ${"2023"}
      ${"académie"}    | ${"84"}      | ${"10"}      | ${undefined}    | ${1.00647948164147}  | ${"2021"}
      ${"académie"}    | ${"84"}      | ${"10"}      | ${undefined}    | ${1.16170212765957}  | ${"2022"}
      ${"académie"}    | ${"84"}      | ${"10"}      | ${undefined}    | ${1.27102803738318}  | ${"2023"}
      ${"département"} | ${"84"}      | ${"10"}      | ${"069"}        | ${1.10483870967742}  | ${"2021"}
      ${"département"} | ${"84"}      | ${"10"}      | ${"069"}        | ${1.20074349442379}  | ${"2022"}
      ${"département"} | ${"84"}      | ${"10"}      | ${"069"}        | ${1.30952380952381}  | ${"2023"}
    `(
      "doit retourner les taux pression $scope pour la rentrée scolaire $rs",
      async ({ scope, codeRegion, codeAcademie, codeDepartement, tauxRemplissage, rs }) => {
        const response = await app.inject({
          method: "GET",
          url: `/api/formation/${cfd}/indicators?codeRegion=${codeRegion}&codeAcademie=${codeAcademie}&codeDepartement=${codeDepartement}`,
        });

        const result = await response.json<Response>();

        const tauxRemplissageFound = result.tauxRemplissages.find(
          (tp) => tp.rentreeScolaire === rs && tp.scope === scope && tp.value === tauxRemplissage
        );

        expect(tauxRemplissageFound).toBeDefined();
      }
    );
  });
});
