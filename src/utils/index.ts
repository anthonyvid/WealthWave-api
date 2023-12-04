import crypto from "crypto";

const SECRET = "WEALTHWAVE-REST-API";

export const authentication = (salt: string, password: string): string => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const comparePasswords = (
  storedHash: string,
  enteredPassword: string,
  salt: string
): boolean => {
  const expectedHash = authentication(salt, enteredPassword);
  return crypto.timingSafeEqual(
    Buffer.from(storedHash, "utf-8"),
    Buffer.from(expectedHash, "utf-8")
  );
};

export const random = () => crypto.randomBytes(128).toString("base64");
