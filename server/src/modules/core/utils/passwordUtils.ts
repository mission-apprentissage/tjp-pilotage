import crypto from "crypto";

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const hashPassword = (password: crypto.BinaryLike, salt?: crypto.BinaryLike) => {
  const iterations = 2;
  const keylen = 64;
  const digest = "sha512";
  salt = salt ?? generateSalt();

  const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);

  return `${hashedPassword.toString("hex")}$${iterations}$${salt}`;
};

export const verifyPassword = (password: crypto.BinaryLike, storedHash: string) => {
  const [hashedStoredPassword, _iterations, salt] = storedHash.split("$");

  if (!hashedStoredPassword) {
    throw new Error("verifyPassword: Invalid stored hash");
  }

  const hashedPasswordWithSalt = hashPassword(password, salt);
  const [hashedPassword] = hashedPasswordWithSalt.split("$");

  if (!hashedPassword) {
    throw new Error("verifyPassword: Invalid hashed password");
  }

  return crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(hashedStoredPassword));
};
