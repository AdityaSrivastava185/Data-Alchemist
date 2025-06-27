"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FileUploadCards = () => {
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handles file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        setTypeError(null);
        setFileName(selectedFile.name);
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target?.result as ArrayBuffer);
        };
      } else {
        setTypeError("❌ Please select a valid Excel or CSV file.");
        setExcelFile(null);
        setFileName(null);
      }
    }
  };

  // Handles file upload and parsing
  const handleFileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(data.slice(0, 10)); // Only show first 10 rows
    }
  };

  return (
    <div className="card-container px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <Card className="w-full max-w-xs md:max-w-sm">
          <CardHeader>
            <CardTitle>Clients Data</CardTitle>
            <CardDescription>
              Upload your clients data to begin the transformation process.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="excelFile">Select Excel/CSV File</Label>
                <Input
                  id="excelFile"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  required
                  onChange={handleFileChange}
                />
              </div>

              {typeError && <p className="text-red-500 text-sm">{typeError}</p>}

              {fileName && (
                <p className="text-sm text-gray-600 truncate">
                  Selected file: <strong>{fileName}</strong>
                </p>
              )}

              <Button type="submit" className="w-full">
                Upload and Parse File
              </Button>
            </form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </div>

      <div className="mt-6 px-4">
        {excelData && excelData.length > 1 ? (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {excelData[0].map((cell: any, idx: number) => (
                    <TableHead key={idx}>{cell}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {excelData.slice(1).map((row: any[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">
            No data available to display
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadCards;
