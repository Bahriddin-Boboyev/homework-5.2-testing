const { NotFoundError } = require("../../shared/errors");
const makeEditUser = require("./edit-user");

describe("Edit user", () => {
  it("agar user bo'lmasa xato qaytarish kerak", () => {
    const User = {
      findOne: jest.fn(null),
      findByIdAndUpdate: jest.fn(),
    };

    const editUser = makeEditUser({ User });

    editUser({ id: "1" }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.findByIdAndUpdate).not.toBeCalled;
    });
  });

  it("avval o'chirilgan userni edit qilmaslik kerak", () => {
    const User = {
      findOne: jest.fn(null),
      findByIdAndUpdate: jest.fn(),
    };

    const editUser = makeEditUser({ User });

    const object = { is_delete: false, username: "username" };

    editUser({ id: "1", object }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.findByIdAndUpdate).not.toBeCalled;
      expect(User.findOne).toBeCalledWith({ _id: "1", is_deleted: false });
    });
  });

  it("agar user topilgan holatda uning ma'lumotlarni to'g'rilash kerak", async () => {
    const existingUser = { _id: 1, username: "username", is_deleted: false };
    const changes = { username: "new_username" };
    const updatedUser = {
      _id: 1,
      username: changes.username,
    };

    const User = {
      findOne: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(existingUser),
      })),

      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(updatedUser),
      })),
    };
    const editUser = makeEditUser({ User });

    const result = await editUser({ id: 1, ...changes });

    expect(result).toEqual(updatedUser);
    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findByIdAndUpdate).toBeCalledTimes(1);
    expect(User.findByIdAndUpdate).toBeCalledWith(1, changes, { new: true });
  });
});
