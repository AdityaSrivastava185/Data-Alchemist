"use client";

// import React, { useRef, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import * as XLSX from "xlsx";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Pagination from "./Pagination";

// const FileUploadCards = () => {
//   const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null);
//   const [typeError, setTypeError] = useState<string | null>(null);
//   const [excelData, setExcelData] = useState<any[][] | null>(null);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [prompt, setPrompt] = useState("");
//   const [loading, setLoading] = useState(false);


//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   const totalPages = excelData
//     ? Math.ceil((excelData.length - 1) / rowsPerPage)
//     : 0;

//   const paginatedRows = excelData
//     ? excelData
//         .slice(1)
//         .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
//     : [];

//   // Handles file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     const allowedTypes = [
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/vnd.ms-excel",
//       "text/csv",
//     ];

//     if (selectedFile) {
//       if (allowedTypes.includes(selectedFile.type)) {
//         setTypeError(null);
//         setFileName(selectedFile.name);
//         const reader = new FileReader();
//         reader.readAsArrayBuffer(selectedFile);
//         reader.onload = (e) => {
//           setExcelFile(e.target?.result as ArrayBuffer);
//         };
//       } else {
//         setTypeError("❌ Please select a valid Excel or CSV file.");
//         setExcelFile(null);
//         setFileName(null);
//       }
//     }
//   };

//   // Handles file upload and parsing
//   const handleFileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (excelFile !== null) {
//       const workbook = XLSX.read(excelFile, { type: "buffer" });
//       const worksheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[worksheetName];
//       const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       setExcelData(data);
//       setCurrentPage(1); // reset to page 1 on new upload
//     }
//   };

//   // Update a specific cell in the dataset
//   const handleCellChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     rowIndex: number,
//     cellIndex: number
//   ) => {
//     if (!excelData) return;
//     const updated = [...excelData];
//     const absoluteRowIndex = (currentPage - 1) * rowsPerPage + rowIndex + 1;
//     updated[absoluteRowIndex][cellIndex] = e.target.value;
//     setExcelData(updated);
//   };

//   const handleNaturalCommand = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);

//     try {
//       const response = await fetch("/api/interpret-prompt", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ data: excelData, prompt }),
//       });

//       const result = await response.json();
//       setExcelData(result.updatedData);
//     } catch (error) {
//       console.error("Error interpreting prompt:", error);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="card-container mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
//         <Card className="w-full max-w-xs md:max-w-sm">
//           <CardHeader>
//             <CardTitle>Clients Data</CardTitle>
//             <CardDescription>
//               Upload your clients data to begin the transformation process.
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleFileSubmit} className="space-y-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="excelFile">Select Excel/CSV File</Label>
//                 <Input
//                   id="excelFile"
//                   type="file"
//                   accept=".csv,.xlsx,.xls"
//                   required
//                   onChange={handleFileChange}
//                 />
//               </div>

//               {typeError && <p className="text-red-500 text-sm">{typeError}</p>}

//               <Button type="submit" className="w-full">
//                 Upload and Parse File
//               </Button>
//             </form>
//           </CardContent>
//           <CardFooter />
//         </Card>
//       </div>

//       <div className="mt-6 px-4 border border-zinc-800 p-2 rounded-md m-4">
//         <div className="my-2">
//           <p>{fileName}</p>
//         </div>

//         {excelData && excelData.length > 1 ? (
//           <>
//           <div className="overflow-x-auto rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   {excelData[0].map((cell: any, idx: number) => (
//                     <TableHead key={idx}>{cell}</TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {paginatedRows.map((row: any[], rowIndex: number) => (
//                   <TableRow key={rowIndex}>
//                     {row.map((cell, cellIndex) => (
//                       <TableCell key={cellIndex}>
//                         <div className="max-w-[300px] overflow-x-auto whitespace-pre-wrap break-words">
//                           <input
//                             className="w-full bg-transparent p-2 border border-transparent focus:outline-none focus:border-blue-500 rounded"
//                             type="text"
//                             value={cell || ""}
//                             onChange={(e) =>
//                               handleCellChange(e, rowIndex, cellIndex)
//                             }
//                             title={cell || ""}
//                           />
//                         </div>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//             <Pagination
//               currentPage={currentPage}
//               setCurrentPage={setCurrentPage}
//               totalPages={totalPages}
//             />
//           </>
//         ) : (
//           <div className="text-center mt-4 text-gray-500">
//             No data available to display
//           </div>
//         )}
//       </div>
//       <div className="space-y-4">
//       {/* Prompt Input */}

//       {/* Your existing editable table comes below */}
//       {/* <EditableTable data={excelData} setData={setExcelData} /> */}
//     </div>
//     </div>
//   );
// };

// export default FileUploadCards;

import React, { useState } from 'react';
import { Sparkles, Database, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import FileUpload from '@/components/fileUpload';
import DataGrid from '@/components/DataGrid';
import RuleInputUI from '@/components/RuleInputUI';
import PriorityControls from '@/components/PriorityControls';
import ExportControls from '@/components/ExportControls';
import NaturalLanguageQuery from '@/components/NaturalLanguageQuery';
import { parseFile } from '@/utils/fileParser';

interface DataRow {
  id: string;
  [key: string]: any;
}

interface BusinessRule {
  id: string;
  type: string;
  name: string;
  priority: number;
  [key: string]: any;
}

interface PrioritySettings {
  dataQuality: number;
  processingSpeed: number;
  resourceEfficiency: number;
  userExperience: number;
  strictValidation: boolean;
  autoCorrection: boolean;
  realTimeProcessing: boolean;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [clientsData, setClientsData] = useState<DataRow[]>([]);
  const [workersData, setWorkersData] = useState<DataRow[]>([]);
  const [tasksData, setTasksData] = useState<DataRow[]>([]);
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [prioritySettings, setPrioritySettings] = useState<PrioritySettings>({
    dataQuality: 75,
    processingSpeed: 60,
    resourceEfficiency: 50,
    userExperience: 80,
    strictValidation: true,
    autoCorrection: false,
    realTimeProcessing: true
  });
  const [filteredData, setFilteredData] = useState<{
    clients: DataRow[];
    workers: DataRow[];
    tasks: DataRow[];
  }>({
    clients: [],
    workers: [],
    tasks: []
  });
  const [activeFilter, setActiveFilter] = useState('');

  const handleFileUpload = async (file: File, type: 'clients' | 'workers' | 'tasks') => {
    try {
      toast({
        title: "Processing file...",
        description: `Parsing ${file.name}`,
      });

      const data = await parseFile(file);
      
      switch (type) {
        case 'clients':
          setClientsData(data);
          break;
        case 'workers':
          setWorkersData(data);
          break;
        case 'tasks':
          setTasksData(data);
          break;
      }

      setUploadedFiles(prev => ({ ...prev, [type]: file.name }));
      
      toast({
        title: "File uploaded successfully!",
        description: `${data.length} records loaded from ${file.name}`,
      });
    } catch (error) {
      console.error('File parsing error:', error);
      toast({
        title: "Upload failed",
        description: `Failed to process ${file.name}. Please check the file format.`,
        variant: "destructive",
      });
    }
  };

  const getAllData = () => {
    return [
      ...clientsData.map(row => ({ ...row, _source: 'clients' })),
      ...workersData.map(row => ({ ...row, _source: 'workers' })),
      ...tasksData.map(row => ({ ...row, _source: 'tasks' }))
    ];
  };

  const handleNaturalLanguageFilter = (filtered: DataRow[], query: string) => {
    if (!query) {
      setFilteredData({
        clients: clientsData,
        workers: workersData,
        tasks: tasksData
      });
      setActiveFilter('');
    } else {
      const clientsFiltered = filtered.filter(row => row._source === 'clients').map(row => {
        const { _source, ...rest } = row;
        return rest;
      });
      const workersFiltered = filtered.filter(row => row._source === 'workers').map(row => {
        const { _source, ...rest } = row;
        return rest;
      });
      const tasksFiltered = filtered.filter(row => row._source === 'tasks').map(row => {
        const { _source, ...rest } = row;
        return rest;
      });
      
      setFilteredData({
        clients: clientsFiltered,
        workers: workersFiltered,
        tasks: tasksFiltered
      });
      setActiveFilter(query);
      
      console.log('Natural language filter applied:', {
        query,
        clientsFound: clientsFiltered.length,
        workersFound: workersFiltered.length,
        tasksFound: tasksFiltered.length
      });
    }
  };

  const getDisplayData = (type: 'clients' | 'workers' | 'tasks') => {
    return activeFilter ? filteredData[type] : 
           type === 'clients' ? clientsData :
           type === 'workers' ? workersData : tasksData;
  };

  const getAvailableTaskIds = () => {
    return tasksData.map(task => task.id || task.taskId || task.TaskID || 'Unknown').filter(Boolean);
  };

  const getAvailableGroups = () => {
    const clientGroups = [...new Set(clientsData.map(client => 
      client.group || client.clientGroup || client.Group || 'Default'
    ))];
    
    const workerGroups = [...new Set(workersData.map(worker => 
      worker.group || worker.workerGroup || worker.Group || 'Default'
    ))];
    
    return {
      clients: clientGroups,
      workers: workerGroups
    };
  };

  const handleRulesGenerated = (rules: BusinessRule[]) => {
    setBusinessRules(rules);
    console.log('Business rules updated:', rules);
  };

  const getValidationRules = () => {
    return businessRules.map(rule => ({
      field: rule.name,
      rule: rule.type,
      message: `Business rule: ${rule.name}`
    }));
  };

  const handleExport = (type: 'data' | 'rules', options: any) => {
    if (type === 'data') {
      const exportData = {
        clients: clientsData,
        workers: workersData,
        tasks: tasksData,
        metadata: options.includeMetadata ? {
          exportDate: new Date().toISOString(),
          prioritySettings,
          totalRecords: clientsData.length + workersData.length + tasksData.length
        } : undefined
      };
      
      console.log('Exporting data:', exportData);
      toast({
        title: "Data exported successfully!",
        description: `Data exported in ${options.format} format`,
      });
    } else {
      const rulesConfig = {
        businessRules,
        prioritySettings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      console.log('Exporting rules:', rulesConfig);
      toast({
        title: "Rules exported successfully!",
        description: "rules.json file generated",
      });
    }
  };

  const hasData = clientsData.length > 0 || workersData.length > 0 || tasksData.length > 0;

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-zinc-900">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center space-x-2" disabled={!hasData}>
              <span>AI Query</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2" disabled={!hasData}>
              <span>Data Review</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center space-x-2">
              <span>Rules</span>
            </TabsTrigger>
            <TabsTrigger value="priorities" className="flex items-center space-x-2">
              <span>Priorities</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Export</span>
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <FileUpload 
              onFileUpload={handleFileUpload}
              uploadedFiles={uploadedFiles}
            />
            
            {hasData && (
              <Card className=''>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Database className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-600 mb-2">Data Loaded Successfully!</h3>
                    <p className="text-zinc-400 mb-4">
                      You have {clientsData.length + workersData.length + tasksData.length} records ready for review and validation.
                    </p>
                    <p className="text-sm text-gray-500">
                      Continue to the next tab to review your data and create validation rules.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Natural Language Query Tab */}
          <TabsContent value="query" className="space-y-6">
            <NaturalLanguageQuery
              allData={getAllData()}
              onFilteredData={handleNaturalLanguageFilter}
            />
          </TabsContent>

          {/* Data Review Tab */}
          <TabsContent value="data" className="space-y-6">
            {getDisplayData('clients').length > 0 && (
              <DataGrid
                data={getDisplayData('clients')}
                title={`Clients Data${activeFilter ? ' (Filtered)' : ''}`}
                onDataChange={setClientsData}
                validationRules={getValidationRules()}
              />
            )}
            
            {getDisplayData('workers').length > 0 && (
              <DataGrid
                data={getDisplayData('workers')}
                title={`Workers Data${activeFilter ? ' (Filtered)' : ''}`}
                onDataChange={setWorkersData}
                validationRules={getValidationRules()}
              />
            )}
            
            {getDisplayData('tasks').length > 0 && (
              <DataGrid
                data={getDisplayData('tasks')}
                title={`Tasks Data${activeFilter ? ' (Filtered)' : ''}`}
                onDataChange={setTasksData}
                validationRules={getValidationRules()}
              />
            )}
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules">
            <RuleInputUI
              availableTaskIds={getAvailableTaskIds()}
              availableGroups={getAvailableGroups()}
              onRulesGenerated={handleRulesGenerated}
            />
          </TabsContent>

          {/* Priorities Tab */}
          <TabsContent value="priorities">
            <PriorityControls
              settings={prioritySettings}
              onSettingsChange={setPrioritySettings}
            />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <ExportControls
              onExport={handleExport}
              hasData={hasData}
              hasRules={businessRules.length > 0}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

