import { createUserFactory } from "./createUser.usecase";

const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
  role: "role",
};

describe("createUser usecase", () => {
  it("should throw an error is the user already exist", async () => {
    const deps = {
      insertUserQuery: jest.fn(async () => {}),
      findUserQuery: jest.fn(async () => ({ email: user.email })),
      shootTemplate: jest.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    expect(() => createUser(user)).rejects.toThrowError("email already exist");
  });

  it("should throw an error is the given email is not valid", async () => {
    const deps = {
      insertUserQuery: jest.fn(async () => {}),
      findUserQuery: jest.fn(async () => undefined),
      shootTemplate: jest.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    expect(() =>
      createUser({ ...user, email: "fakeEmail" })
    ).rejects.toThrowError("email is not valid");
  });

  it("should create the user and send the activation email", async () => {
    const deps = {
      insertUserQuery: jest.fn(async () => {}),
      findUserQuery: jest.fn(async () => undefined),
      shootTemplate: jest.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    await createUser(user);

    await expect(deps.insertUserQuery).toBeCalled();
    await expect(deps.shootTemplate).toBeCalledWith(
      expect.objectContaining({ template: "activate_account" })
    );
  });
});
