const { NotFoundError } = require("../../shared/errors");
const makeRemoveUser = require("./remove-user");

describe("Remove user", () => {
  it("agar user bo'lmasa xato qaytarish kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const removeUser = makeRemoveUser({ User });

    removeUser({ id: "1" }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
    });
  });

  it("avval o'chirilgan foydalanuvchini qaytarmasligi kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const removeUser = makeRemoveUser({ User });

    removeUser({ id: "1" }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.findOne).toBeCalledWith({ _id: "1", is_deleted: false });
    });
  });

  it("agar user topilsa uni soft deleted qilish kerak", () => {
    const existingUser = { _id: "1", username: "username", is_deleted: false };

    const updatedUser = {
      _id: "1",
      username: `${existingUser.username}_deleted`,
    };

    const User = {
      findOne: jest.fn().mockResolvedValue(existingUser),
      findByIdAndUpdate: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(updatedUser),
      })),
    };

    const removeUser = makeRemoveUser({ User });

    removeUser({ id: "1" }).then((result) => {
      expect(result).toBe(updatedUser);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.findByIdAndUpdate).toBeCalledTimes(1);
      expect(User.findByIdAndUpdate).toBeCalledWith(updatedUser._id, {
        is_deleted: true,
        username: updatedUser.username,
      });
    });
  });
});
