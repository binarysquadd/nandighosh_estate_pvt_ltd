'use server';

import { getSheetData, addSheetRow } from '@/lib/google-sheets';

export async function getData() {
  try {
    const data = await getSheetData('Master');
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addData(formData: {
  dataset: string;
  source: string;
  abstract: string;
  link: string;
}) {
  try {
    await addSheetRow('Master', formData);
    return { success: true, message: 'Data added successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}