import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export async function getGoogleSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt);
  await doc.loadInfo();
  return doc;
}

export async function getSheetData(sheetName: string) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle[sheetName];
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  const rows = await sheet.getRows();
  return rows.map(row => row.toObject());
}

export async function addSheetRow(sheetName: string, data: Record<string, any>) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle[sheetName];
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  await sheet.addRow(data);
}