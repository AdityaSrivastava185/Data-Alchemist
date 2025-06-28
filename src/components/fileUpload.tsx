"use client"
import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (file: File, type: 'clients' | 'workers' | 'tasks') => void;
  uploadedFiles: Record<string, string>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFiles }) => {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent, type: 'clients' | 'workers' | 'tasks') => {
    e.preventDefault();
    setDragOver(null);
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      onFileUpload(file, type);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'clients' | 'workers' | 'tasks') => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file, type);
    }
  };

  const UploadCard = ({ type, title, description }: { type: 'clients' | 'workers' | 'tasks', title: string, description: string }) => (
    <Card 
      className={`transition-all duration-200 ${
        dragOver === type ? 'border-blue-500 bg-blue-50' : 'border-solid border-zinc-800 hover:border-zinc-700'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(type); }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {uploadedFiles[type] ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-700">{title} Uploaded</h3>
                <p className="text-sm text-green-600">{uploadedFiles[type]}</p>
              </div>
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-zinc-400">{description}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`file-${type}`)?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                </Button>
                <p className="text-xs text-zinc-400">or drag & drop CSV/XLSX</p>
              </div>
            </>
          )}
          <input
            id={`file-${type}`}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => handleFileSelect(e, type)}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold  mb-2">Upload Your Data</h2>
        <p className="text-zinc-400">Upload CSV or XLSX files for each data type to begin the transformation process.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <UploadCard 
          type="clients" 
          title="Clients Data" 
          description="Upload your client information and contact details"
        />
        <UploadCard 
          type="workers" 
          title="Workers Data" 
          description="Upload employee and contractor information"
        />
        <UploadCard 
          type="tasks" 
          title="Tasks Data" 
          description="Upload project tasks and assignments"
        />
      </div>
    </div>
  );
};

export default FileUpload;
