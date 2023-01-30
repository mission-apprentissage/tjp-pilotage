import fastifyCors from "@fastify/cors";
import "dotenv/config";
import { registerCoreModule } from "./modules/core";
import { server } from "./server";

server.register(fastifyCors, {});

server.register(
  async (instance) => {
    registerCoreModule({ server: instance });
  },
  { prefix: "/api" }
);

server.listen({ port: 5000, host: "0.0.0.0" }, function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});
