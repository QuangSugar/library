const bcrypt = require("bcrypt");
const { Users } = require("../models");

exports.createAdmin = async () => {
  const username = process.env.DEFAULT_ADMIN_USERNAME;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  const email = process.env.DEFAULT_ADMIN_MAIL;
  try {
    const admin = await Users.findOne({ username: username });
    if (admin !== null) {
      return true;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const newAdmin = new Users({
      name: username,
      password: passwordHash,
      email,
      role: 1
    });
    await newAdmin.save();
    console.log("--------------------------");
    console.log("Admin created with");
    console.log(`Username => ${username}`);
    console.log(`Password => ${password}`);
    console.log("--------------------------");
  } catch (err) {
    return false;
  }
};
