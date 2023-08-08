const { NotFoundError } = require("../../shared/errors");

function makeRemoveUser({ User }) {
  return async function removeUser({ id }) {
    const existing = await User.findOne({ _id: id, is_deleted: false });

    if (!existing) {
      throw new NotFoundError("Foydalanuvchi topilmadi.");
    }

    return User.findByIdAndUpdate(id, {
      is_deleted: true,
      username: `${existing.username}_deleted`,
    }).select("-password -is_deleted");
  };
}

module.exports = makeRemoveUser;
