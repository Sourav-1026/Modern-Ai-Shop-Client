/**
 * Fetch helper that retrieves a valid JWT signed by the Next.js server
 * and forwards it to the Express backend in the Authorization header.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = "";
  try {
    const tokenRes = await fetch("/api/auth/token");
    if (tokenRes.ok) {
      const data = await tokenRes.json();
      token = data.token;
    }
  } catch (error) {
    console.warn("Could not retrieve authentication token:", error);
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers
  });
}
