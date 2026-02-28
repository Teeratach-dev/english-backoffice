import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

export async function createToken(payload: any, expiresIn: string = "1d") {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function createAccessToken(payload: any) {
  return createToken(payload, "1d");
}

export async function createRefreshToken(payload: any) {
  return createToken(payload, "7d");
}

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
