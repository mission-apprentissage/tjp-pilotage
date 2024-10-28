// TODO

// import { build } from "@/build";
// import { getKbdClient } from "@/db/db";
// import type { Server } from "@/server/server";
// import { server as fastifyServer } from "@/server/server";

// describe("GET /api/region/:codeRegion", () => {
//   let server: Server;

//   beforeAll(async () => {
//     server = await build(fastifyServer);
//     await server.ready();
//   });

//   afterAll(async () => {
//     await server.close(() => getKbdClient().destroy());
//   });

//   it("doit retrouver les données de la région Auvergne-Rhône-Alpes (84)", async () => {
//     const response = await server.inject({
//       method: "GET",
//       url: "/api/region/84",
//     });

//     expect(response.statusCode).toBe(200);
//     expect(response.json()).toEqual({
//       libelleRegion: "Auvergne-Rhône-Alpes",
//       effectifEntree: 18975,
//       effectifTotal: 312,
//       nbFormations: 83,
//       tauxRemplissage: 0.958655414509609,
//       tauxPoursuite: 0.527412267428488,
//       tauxInsertion: 0.514395491803279,
//       tauxDevenirFavorable: 0.77049259712117,
//     });
//   });

//   it("doit retrouver les données de la région Auvergne-Rhône-Alpes (84) pour un BTS (320)", async () => {
//     const response = await server.inject({
//       method: "GET",
//       url: "/api/region/84?codeNiveauDiplome[]=320",
//     });

//     expect(response.statusCode).toBe(200);
//     expect(response.json()).toEqual({
//       libelleRegion: "Auvergne-Rhône-Alpes",
//       effectifEntree: 10165,
//       effectifTotal: 18403,
//       nbFormations: 96,
//       tauxRemplissage: 0.79200970621371,
//       tauxPoursuite: 0.476512025342837,
//       tauxInsertion: 0.640178358149534,
//       tauxDevenirFavorable: 0.811637697469885,
//     });
//   });
// });
