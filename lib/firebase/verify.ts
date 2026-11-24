import { createRemoteJWKSet, jwtVerify } from "jose";

// Verifies a Firebase ID token on the server without a service account:
// the signature is checked against Google's public keys.
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

export interface AuthedUser {
  uid: string;
  token: string;
}

export async function verifyRequest(request: Request): Promise<AuthedUser | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!projectId || !token) return null;
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    return payload.sub ? { uid: payload.sub, token } : null;
  } catch {
    return null;
  }
}
