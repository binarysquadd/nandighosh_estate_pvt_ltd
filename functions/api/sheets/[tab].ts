/* Cloudflare Pages Function: Google Sheets API handler
   Compatible with Edge runtime & TypeScript strict mode
*/

export interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
}

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

/**
 * Small helper to send JSON responses
 */
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Exchange service account credentials for an access token
 */
async function getAccessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = btoa(
    JSON.stringify({
      iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const encoder = new TextEncoder();
  const toSign = encoder.encode(`${header}.${claim}`);
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    str2ab(env.GOOGLE_PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, toSign);
  const jwt = `${header}.${claim}.${arrayBufferToBase64(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json<{ access_token: string }>();
  return data.access_token;
}

/**
 * Convert a PEM private key to ArrayBuffer for WebCrypto
 */
function str2ab(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----[^-]+-----/g, "")
    .replace(/\s+/g, "")
    .trim();
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/**
 * Base64 encode ArrayBuffer for JWT
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * GET handler: read tab data
 */
export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const tab = decodeURIComponent(String((params as any).tab || ""));
    if (!tab) return json({ error: "Missing tab" }, 400);

    const token = await getAccessToken(env);
    const res = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(tab)}!A1:Z1000`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const txt = await res.text();
      return json({ error: `Sheets read failed: ${txt}` }, res.status);
    }

    const data = (await res.json()) as { values?: string[][] };
    if (!data.values || data.values.length < 2) return json({ data: [] });

    const [headers, ...rows] = data.values;
    const result = rows.map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = r[i] ?? ""));
      return obj;
    });

    return json({ data: result });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

/**
 * POST handler: append new row
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const tab = decodeURIComponent(String((params as any).tab || ""));
    if (!tab) return json({ error: "Missing tab" }, 400);

    const parsed = await request.json();
    const body =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, any>)
        : {};

    const token = await getAccessToken(env);

    // Get headers for the tab
    const headerResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(`${tab}!A1:Z1`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const headerJson = (await headerResp.json()) as { values?: string[][] };
    const headers = headerJson.values?.[0] ?? Object.keys(body);

    // Build row data in correct order
    const row = headers.map((h) => body[h] ?? "");

    const appendResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(
        `${tab}!A1`
      )}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
      }
    );

    if (!appendResp.ok) {
      const txt = await appendResp.text();
      return json({ error: `Sheets append failed: ${txt}` }, 500);
    }

    return json({ success: true });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};