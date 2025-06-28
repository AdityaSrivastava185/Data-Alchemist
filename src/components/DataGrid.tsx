"use client"
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataRow {
  id: string;
  [key: string]: any;
  errors?: string[];
  warnings?: string[];
}

interface DataGridProps {
  data: DataRow[];
  title: string;
  onDataChange: (data: DataRow[]) => void;
  validationRules?: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
}

const ITEMS_PER_PAGE = 10;

const DataGrid: React.FC<DataGridProps> = ({ data, title, onDataChange, validationRules = [] }) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [validatedData, setValidatedData] = useState<DataRow[]>(data);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(validatedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = validatedData.slice(startIndex, endIndex);

  useEffect(() => {
    // Run validation on data
    const validated = data.map(row => {
      const errors: string[] = [];
      const warnings: string[] = [];

      validationRules.forEach(rule => {
        const value = row[rule.field];
        switch (rule.rule) {
          case 'required':
            if (!value || value.toString().trim() === '') {
              errors.push(rule.message);
            }
            break;
          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push(rule.message);
            }
            break;
          case 'phone':
            if (value && !/^\+?[\d\s-()]+$/.test(value)) {
              warnings.push(rule.message);
            }
            break;
          case 'date':
            if (value && isNaN(Date.parse(value))) {
              errors.push(rule.message);
            }
            break;
        }
      });

      return { ...row, errors, warnings };
    });

    setValidatedData(validated);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data, validationRules]);

  const handleEditStart = (rowId: string, field: string, currentValue: any) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue || '');
  };

  const handleEditSave = () => {
    if (!editingCell) return;

    const updatedData = validatedData.map(row => 
      row.id === editingCell.rowId 
        ? { ...row, [editingCell.field]: editValue }
        : row
    );

    onDataChange(updatedData);
    setEditingCell(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setEditingCell(null); // Cancel any ongoing edits when changing pages
  };

  if (!data.length) return null;

  const columns = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'errors' && key !== 'warnings');
  const errorCount = validatedData.filter(row => row.errors && row.errors.length > 0).length;
  const warningCount = validatedData.filter(row => row.warnings && row.warnings.length > 0).length;

  return (
    <Card className="w-full bg-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>{title}</span>
            <Badge variant="secondary">{data.length} records</Badge>
          </CardTitle>
          <div className="flex space-x-2">
            {errorCount > 0 && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errorCount} errors</span>
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="flex items-center space-x-1 text-yellow-600 border-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                <span>{warningCount} warnings</span>
              </Badge>
            )}
            {errorCount === 0 && warningCount === 0 && (
              <Badge variant="outline" className="flex items-center space-x-1 text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>All valid</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {columns.map(column => (
                  <th key={column} className="text-left p-2 text-zinc-200 capitalize">
                    {column.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
                {/* <th className="text-left p-3 font-medium text-zinc-200">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {currentData.map(row => (
                <tr 
                  key={row.id} 
                  className={`border-b hover:bg-zinc-900 ${
                    row.errors?.length ? 'bg-red-50' : row.warnings?.length ? 'bg-yellow-50' : ''
                  }`}
                >
                  {columns.map(column => (
                    <td key={column} className="p-3">
                      {editingCell?.rowId === row.id && editingCell?.field === column ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="sm" variant="outline" onClick={handleEditSave}>
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleEditCancel}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center space-x-2 cursor-pointer hover:bg-zinc-900 p-1 rounded"
                          onClick={() => handleEditStart(row.id, column, row[column])}
                        >
                          <span>{row[column] || '-'}</span>
                          <Edit3 className="h-3 w-3 opacity-50" />
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="flex flex-col space-y-1">
                      {row.errors?.map((error, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {error}
                        </Badge>
                      ))}
                      {row.warnings?.map((warning, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                          {warning}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        <div className="mt-2 text-sm text-gray-500 text-center">
          Showing {startIndex + 1} to {Math.min(endIndex, validatedData.length)} of {validatedData.length} records
        </div>
      </CardContent>
    </Card>
  );
};

export default DataGrid;
