import bcrypt from "bcrypt";
import logger from "../config/logger";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (err) {
    logger.error(`Error hashing password: ${err}`);
    throw new Error("Password hashing failed");
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    logger.error(`Error comparing passwords: ${err}`);
    throw new Error("Password comparison failed");
  }
};
