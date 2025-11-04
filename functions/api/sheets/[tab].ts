// /functions/api/sheets/[tab].ts
// Cloudflare Pages Function – Edge-safe Google Sheets proxy
import { SignJWT, importPKCS8, jwtVerify } from "jose";

type Env = {
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string; // stored with literal newlines in CF Pages (no \n escaping)
  GOOGLE_SHEET_ID: string;
};

const GOOGLE_TOKEN_AUD = "https://oauth2.googleapis.com/token";
const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

async function getAccessToken(env: Env): Promise<string> {
  // Convert PEM to a PKCS#8 key for jose
  const privateKeyPEM = env.GOOGLE_PRIVATE_KEY;
  const alg = "RS256";

  const pkcs8 = await importPKCS8(privateKeyPEM, alg);

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 55; // 55 minutes

  const jwt = await new SignJWT({
    iss: env.GOOGLE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: GOOGLE_TOKEN_AUD,
  })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .setIssuer(env.GOOGLE_CLIENT_EMAIL)
    .setAudience(GOOGLE_TOKEN_AUD)
    .sign(pkcs8);

  const form = new URLSearchParams();
  form.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  form.set("assertion", jwt);

  const resp = await fetch(GOOGLE_TOKEN_AUD, {
    method: "POST",
    body: form,
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`OAuth token error: ${resp.status} ${t}`);
  }
  const data = (await resp.json()) as { access_token: string };
  return data.access_token;
}

function json(data: unknown, init: number | ResponseInit = 200): Response {
  const initObj = typeof init === "number" ? { status: init } : init;
  return new Response(JSON.stringify(data), {
    ...initObj,
    headers: { "content-type": "application/json; charset=utf-8", ...(initObj as any).headers },
  });
}

// Map A1:Z rows -> array of objects
function rowsToObjects(rows: string[][]) {
  const [headers, ...rest] = rows;
  return rest.map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? "";
    });
    return obj;
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const tab = decodeURIComponent(String((params as any).tab || ""));
    if (!tab) return json({ error: "Missing tab" }, 400);

    const token = await getAccessToken(env);
    const range = encodeURIComponent(`${tab}!A1:Z1000`);

    const resp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      return json({ error: `Sheets GET failed: ${txt}` }, 500);
    }
    const data = (await resp.json()) as { values?: string[][] };
    if (!data.values || data.values.length === 0) {
      return json({ data: [] });
    }
    return json({ data: rowsToObjects(data.values) });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const tab = decodeURIComponent(String((params as any).tab || ""));
    if (!tab) return json({ error: "Missing tab" }, 400);

    const body = await request.json();
    const token = await getAccessToken(env);

    // Fetch headers to keep column order
    const headerResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(`${tab}!A1:Z1`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const headerJson = (await headerResp.json()) as { values?: string[][] };

    // Explicitly treat the parsed JSON body as a plain object
    const bodyObj = (body && typeof body === "object" && !Array.isArray(body)) ? body as Record<string, any> : {};
    const headers = headerJson.values?.[0] ?? Object.keys(bodyObj);

    const row = headers.map((h) => body[h] ?? "");

    const appendResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(`${tab}!A1`)}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
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

// PUT: update row by id match in column "id"
export const onRequestPut: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const tab = decodeURIComponent(String((params as any).tab || ""));
    if (!tab) return json({ error: "Missing tab" }, 400);
    const body = await request.json();
    const id = body.id;
    if (!id) return json({ error: "Missing id" }, 400);

    const token = await getAccessToken(env);
    const rangeA1 = `${tab}!A1:Z1000`;

    // Get all rows
    const rowsResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(rangeA1)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const rowsJson = (await rowsResp.json()) as { values?: string[][] };
    const rows = rowsJson.values ?? [];
    if (rows.length === 0) return json({ error: "No rows" }, 404);
    const headers = rows[0];
    const idIdx = headers.indexOf("id");
    if (idIdx === -1) return json({ error: 'No "id" column' }, 400);

    const rowIndex = rows.findIndex((r, i) => i > 0 && r[idIdx] === id);
    if (rowIndex === -1) return json({ error: "Row not found" }, 404);

    const newRow = headers.map((h) => body[h] ?? "");
    // Update that single row (1-based row numbers)
    const updateResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(`${tab}!A${rowIndex + 1}`)}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ values: [newRow] }),
      }
    );
    if (!updateResp.ok) {
      const txt = await updateResp.text();
      return json({ error: `Sheets update failed: ${txt}` }, 500);
    }
    return json({ success: true });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

// DELETE: delete row by id (requires finding the sheetId + row index)
async function getSheetIdByTitle(sheetId: string, title: string, token: string): Promise<number> {
  const metaResp = await fetch(`${SHEETS_BASE}/${sheetId}?fields=sheets.properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meta = (await metaResp.json()) as {
    sheets: { properties: { sheetId: number; title: string } }[];
  };
  const found = meta.sheets.find((s) => s.properties.title === title);
  if (!found) throw new Error(`Tab "${title}" not found`);
  return found.properties.sheetId;
}

export const onRequestDelete: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const tab = decodeURIComponent(String((params as any).tab || ""));
    if (!tab) return json({ error: "Missing tab" }, 400);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, 400);

    const token = await getAccessToken(env);
    const rangeA1 = `${tab}!A1:Z1000`;

    // Find row index
    const rowsResp = await fetch(
      `${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(rangeA1)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const rowsJson = (await rowsResp.json()) as { values?: string[][] };
    const rows = rowsJson.values ?? [];
    if (rows.length === 0) return json({ error: "No rows" }, 404);
    const headers = rows[0];
    const idIdx = headers.indexOf("id");
    if (idIdx === -1) return json({ error: 'No "id" column' }, 400);

    const rowIndex = rows.findIndex((r, i) => i > 0 && r[idIdx] === id);
    if (rowIndex === -1) return json({ error: "Row not found" }, 404);

    // Find sheetId and delete the row via batchUpdate
    const sheetNumericId = await getSheetIdByTitle(env.GOOGLE_SHEET_ID, tab, token);

    const batchResp = await fetch(`${SHEETS_BASE}/${env.GOOGLE_SHEET_ID}:batchUpdate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetNumericId,
                dimension: "ROWS",
                startIndex: rowIndex, // zero-based; includes header row indexing
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      }),
    });

    if (!batchResp.ok) {
      const txt = await batchResp.text();
      return json({ error: `Sheets delete failed: ${txt}` }, 500);
    }
    return json({ success: true });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};