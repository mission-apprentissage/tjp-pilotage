// TODO repair
describe("POST /api/auth/login", () => {
  // @ts-expect-error
  let server;

  // beforeAll(async () => {
  //   server = await build(fastifyServer);
  //   await server.ready();
  // });

  // afterAll(async () => {
  //   await server.close(async () => getKbdClient().destroy());
  // });

  it("doit retourner une erreur 401 car l'utilisateur n'existe pas en base de donnée", async () => {
    // @ts-expect-error
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "jean.charles@edu.gouv.fr",
        password: "1234Orion!",
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
