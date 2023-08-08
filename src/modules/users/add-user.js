const { BadRequestError } = require("../../shared/errors");

function makeAddUser({ User, bcrypt }) {
  return async function addUser(data) {
    const exists = User.findOne({ username: data.username });

    if (exists) {
      throw new BadRequestError("Bu user allaqachon mavjud!");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await User.create({
      ...data,
      password: hashedPassword,
    });

    const { password, is_deleted, ...rest } = result.toObject();

    return rest;
  };
}

module.exports = makeAddUser;
