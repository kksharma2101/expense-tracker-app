import bcrypt from "bcryptjs";

export const passwordHash = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (e) {
    console.log(e.message);
  }
};

export const passwordCompare = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
