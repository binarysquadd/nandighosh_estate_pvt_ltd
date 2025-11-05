import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';

export async function GET(
  request: Request,
  context: { params: Promise<{ tab: string }> }
) {
  try {
    const { tab } = await context.params;
    const data = await getSheetData(tab);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}