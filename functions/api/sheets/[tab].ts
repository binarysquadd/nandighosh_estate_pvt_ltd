export interface Env {
  GOOGLE_SHEET_ID: string;
  GOOGLE_SHEETS_API_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { params, env } = context;

  try {
    const tab = (params as Record<string, string>).tab;
    if (!tab) {
      return new Response(JSON.stringify({ error: "Missing sheet name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${
      env.GOOGLE_SHEET_ID
    }/values/${encodeURIComponent(tab)}?key=${env.GOOGLE_SHEETS_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch ${tab}`, status: res.status }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const json = await res.json();
    const values = json.values || [];
    if (values.length < 2) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const [headers, ...rows] = values;
    const result = rows.map((r: string[]) =>
      Object.fromEntries(headers.map((h: string, i: number) => [h, r[i] ?? ""]))
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};