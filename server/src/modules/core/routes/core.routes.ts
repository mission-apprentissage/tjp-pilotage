import { salut } from "shared";

import { Server } from "../../../server";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get("/", async (request, response) => {
    response.status(200).send({ hello: salut });
  });
};
