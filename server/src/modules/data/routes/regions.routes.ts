// import { ROUTES_CONFIG } from "shared";

// import { Server } from "../../../server";
// import { getRegions } from "../queries/getRegions/getRegions.query";
// import { getRegionStats } from "../queries/getRegionStats/getRegionStats.query";

// export const regionsRoutes = ({ server }: { server: Server }) => {
//   server.get(
//     "/regions",
//     { schema: ROUTES_CONFIG.getRegions },
//     async (_, response) => {
//       const regions = await getRegions();
//       response.status(200).send(regions);
//     }
//   );

//   server.get(
//     "/region/:codeRegion",
//     { schema: ROUTES_CONFIG.getRegionStats },
//     async (request, response) => {
//       const regionStats = await getRegionStats({
//         ...request.params,
//         ...request.query,
//       });
//       if (!regionStats) return response.status(404).send();
//       response.status(200).send(regionStats);
//     }
//   );
// };
