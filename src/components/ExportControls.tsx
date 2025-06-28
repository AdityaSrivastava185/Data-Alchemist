"use client"
import React from 'react';
import { Download, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  includeMetadata: boolean;
  includeValidationResults: boolean;
  cleanedDataOnly: boolean;
}

interface ExportControlsProps {
  onExport: (type: 'data' | 'rules', options: ExportOptions) => void;
  hasData: boolean;
  hasRules: boolean;
}

const ExportControls: React.FC<ExportControlsProps> = ({ onExport, hasData, hasRules }) => {
  const [exportOptions, setExportOptions] = React.useState<ExportOptions>({
    format: 'xlsx',
    includeMetadata: true,
    includeValidationResults: true,
    cleanedDataOnly: true
  });

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export & Download</span>
        </CardTitle>
        <p className="text-sm text-zinc-600">
          Export your cleaned data and business rules for the next stage of your process.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Export Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">File Format</Label>
              <Select value={exportOptions.format} onValueChange={(value: 'csv' | 'xlsx' | 'json') => updateOption('format', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="metadata">Include Metadata</Label>
                <p className="text-xs text-gray-500">Export timestamps, processing info, and statistics</p>
              </div>
              <Switch
                id="metadata"
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) => updateOption('includeMetadata', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="validation">Include Validation Results</Label>
                <p className="text-xs text-gray-500">Export error logs and validation status</p>
              </div>
              <Switch
                id="validation"
                checked={exportOptions.includeValidationResults}
                onCheckedChange={(checked) => updateOption('includeValidationResults', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cleaned">Cleaned Data Only</Label>
                <p className="text-xs text-gray-500">Export only validated and corrected records</p>
              </div>
              <Switch
                id="cleaned"
                checked={exportOptions.cleanedDataOnly}
                onCheckedChange={(checked) => updateOption('cleanedDataOnly', checked)}
              />
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">Download Files</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => onExport('data', exportOptions)}
              disabled={!hasData}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export Data</span>
            </Button>

            <Button
              onClick={() => onExport('rules', exportOptions)}
              disabled={!hasRules}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Export Rules.json</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Data export includes all processed tables with your selected options</p>
            <p>• Rules.json contains all validation rules and processing configuration</p>
            <p>• Files are ready for import into your next workflow stage</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportControls;
