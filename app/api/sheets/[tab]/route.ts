import { NextResponse } from "next/server";
import { getGoogleSheet, getSheetData } from "@/lib/google-sheets";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ tab: string }> } // 👈 note: params is a Promise now
) {
  try {
    const { tab } = await ctx.params; // 👈 unwrap it
    const sheetName = decodeURIComponent(tab);

    const data = await getSheetData(sheetName);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("❌ Sheets GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ tab: string }> }
) {
  try {
    const { tab } = await ctx.params;
    const sheetName = decodeURIComponent(tab);
    const body = await req.json();

    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

    await sheet.addRow(body);
    return NextResponse.json({ success: true, message: "Row added successfully" });
  } catch (error: any) {
    console.error("❌ Sheets POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ tab: string }> }
) {
  try {
    const { tab } = await ctx.params;
    const sheetName = decodeURIComponent(tab);
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing 'id' field" }, { status: 400 });
    }

    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

    const rows = await sheet.getRows();
    const targetRow = rows.find((r) => (r as any).id === id);
    if (!targetRow) {
      return NextResponse.json({ success: false, error: "Row not found" }, { status: 404 });
    }

    Object.entries(updates).forEach(([key, value]) => {
      (targetRow as any)[key] = value;
    });

    await targetRow.save();

    return NextResponse.json({ success: true, message: "Row updated successfully" });
  } catch (error: any) {
    console.error("❌ Sheets PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ tab: string }> }
) {
  try {
    const { tab } = await ctx.params;
    const sheetName = decodeURIComponent(tab);
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing 'id' query param" }, { status: 400 });
    }

    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

    const rows = await sheet.getRows();
    const targetRow = rows.find((r) => (r as any).id === id);
    if (!targetRow) {
      return NextResponse.json({ success: false, error: "Row not found" }, { status: 404 });
    }

    await targetRow.delete();
    return NextResponse.json({ success: true, message: "Row deleted successfully" });
  } catch (error: any) {
    console.error("❌ Sheets DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}