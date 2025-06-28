import Papa from 'papaparse'
import * as XLSX from 'xlsx';

export interface ParsedData {
  id: string;
  [key: string]: any;
}

export const parseFile = (file: File): Promise<ParsedData[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      // Parse CSV using Papa Parse
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            ...row
          }));
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Parse Excel using XLSX
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const parsedData = jsonData.map((row: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            ...row
          }));
          
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file format'));
    }
  });
};
