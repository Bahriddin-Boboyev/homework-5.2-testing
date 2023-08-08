const makeAddUser = require("./add-user");
const bcryptjs = require("bcryptjs");
const { BadRequestError } = require("../../shared/errors");
describe("Add user", () => {
  it("agar avval shu username li user bo'lsa xato qaytarishi kerak!", async () => {
    const User = {
      findOne: jest.fn().mockReturnValue({ username: "username" }),
      create: jest.fn().mockResolvedValue(null),
    };
    const mockedBcrypt = {
      hash: jest.fn().mockResolvedValue("hashedPassword"),
    };

    const addUser = makeAddUser({ User, bcryptjs: mockedBcrypt });

    const data = { username: "username", password: "password" };

    addUser(data).catch((err) => {
      expect(err instanceof BadRequestError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.create).not.toBeCalled;
      expect(User.hash).not.toBeCalled;
    });
  });
});
