"use client"
import React from 'react';
import { Sliders, Target, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PrioritySettings {
  dataQuality: number;
  processingSpeed: number;
  resourceEfficiency: number;
  userExperience: number;
  strictValidation: boolean;
  autoCorrection: boolean;
  realTimeProcessing: boolean;
}

interface PriorityControlsProps {
  settings: PrioritySettings;
  onSettingsChange: (settings: PrioritySettings) => void;
}

const PriorityControls: React.FC<PriorityControlsProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (key: keyof PrioritySettings, value: number | boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sliders className="h-5 w-5" />
          <span>System Priorities</span>
        </CardTitle>
        <p className="text-sm text-zinc-600">
          Adjust how the system balances different priorities when processing your data.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Priority Sliders */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Data Quality Priority</span>
              </Label>
              <span className="text-sm font-medium">{settings.dataQuality}%</span>
            </div>
            <Slider
              value={[settings.dataQuality]}
              onValueChange={(value) => updateSetting('dataQuality', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Higher values prioritize thorough validation and cleaning</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Processing Speed Priority</span>
              </Label>
              <span className="text-sm font-medium">{settings.processingSpeed}%</span>
            </div>
            <Slider
              value={[settings.processingSpeed]}
              onValueChange={(value) => updateSetting('processingSpeed', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Higher values prioritize faster processing over thoroughness</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Resource Efficiency Priority</span>
              </Label>
              <span className="text-sm font-medium">{settings.resourceEfficiency}%</span>
            </div>
            <Slider
              value={[settings.resourceEfficiency]}
              onValueChange={(value) => updateSetting('resourceEfficiency', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Higher values optimize for lower memory and CPU usage</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>User Experience Priority</span>
              </Label>
              <span className="text-sm font-medium">{settings.userExperience}%</span>
            </div>
            <Slider
              value={[settings.userExperience]}
              onValueChange={(value) => updateSetting('userExperience', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Higher values prioritize responsive UI and clear feedback</p>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium text-zinc-600">Processing Options</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="strict-validation">Strict Validation Mode</Label>
              <p className="text-xs text-gray-500">Enforce all validation rules without exceptions</p>
            </div>
            <Switch
              id="strict-validation"
              checked={settings.strictValidation}
              onCheckedChange={(checked) => updateSetting('strictValidation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-correction">Auto-Correction</Label>
              <p className="text-xs text-gray-500">Automatically fix common data issues when possible</p>
            </div>
            <Switch
              id="auto-correction"
              checked={settings.autoCorrection}
              onCheckedChange={(checked) => updateSetting('autoCorrection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="real-time">Real-time Processing</Label>
              <p className="text-xs text-gray-500">Process and validate data as it's being edited</p>
            </div>
            <Switch
              id="real-time"
              checked={settings.realTimeProcessing}
              onCheckedChange={(checked) => updateSetting('realTimeProcessing', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityControls;
