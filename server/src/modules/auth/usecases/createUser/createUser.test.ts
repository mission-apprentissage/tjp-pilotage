import { createUserFactory } from "./createUser.usecase";

const jwtSecret = "jwtSecret";

const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
};

describe("createUser usecase", () => {
  it("should create the user and send the activation email", async () => {
    const deps = {
      insertUserQuery: jest.fn(async () => {}),
      shootTemplate: jest.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    await createUser({
      email: "test@test.fr",
      role: "role",
      firstname: "firstname",
      lastname: "lastname",
    });

    await expect(deps.insertUserQuery).toBeCalled();
    await expect(deps.shootTemplate).toBeCalledWith(
      expect.objectContaining({ template: "activate_account" })
    );
  });
});
