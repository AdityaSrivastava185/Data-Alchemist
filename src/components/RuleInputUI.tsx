"use client"
import React, { useState } from 'react';
import { Plus, Download, Settings, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface CoRunRule {
  id: string;
  type: 'coRun';
  name: string;
  tasks: string[];
  priority: number;
}

interface SlotRestrictionRule {
  id: string;
  type: 'slotRestriction';
  name: string;
  targetGroup: string;
  groupType: 'client' | 'worker';
  minCommonSlots: number;
  priority: number;
}

interface LoadLimitRule {
  id: string;
  type: 'loadLimit';
  name: string;
  workerGroup: string;
  maxSlotsPerPhase: number;
  priority: number;
}

interface PhaseWindowRule {
  id: string;
  type: 'phaseWindow';
  name: string;
  taskId: string;
  allowedPhases: string[];
  priority: number;
}

interface PatternMatchRule {
  id: string;
  type: 'patternMatch';
  name: string;
  regex: string;
  template: string;
  parameters: Record<string, any>;
  priority: number;
}

interface PrecedenceRule {
  id: string;
  type: 'precedence';
  name: string;
  scope: 'global' | 'specific';
  targetRules: string[];
  explicitOrder: number;
  priority: number;
}

type BusinessRule = CoRunRule | SlotRestrictionRule | LoadLimitRule | PhaseWindowRule | PatternMatchRule | PrecedenceRule;

interface RuleInputUIProps {
  availableTaskIds: string[];
  availableGroups: { clients: string[]; workers: string[] };
  onRulesGenerated: (rules: BusinessRule[]) => void;
}

const RuleInputUI: React.FC<RuleInputUIProps> = ({ 
  availableTaskIds, 
  availableGroups, 
  onRulesGenerated 
}) => {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [activeRuleType, setActiveRuleType] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Co-Run Rule State
  const [coRunName, setCoRunName] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Slot Restriction Rule State
  const [slotRestrictionName, setSlotRestrictionName] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [groupType, setGroupType] = useState<'client' | 'worker'>('worker');
  const [minCommonSlots, setMinCommonSlots] = useState(1);

  // Load Limit Rule State
  const [loadLimitName, setLoadLimitName] = useState('');
  const [workerGroup, setWorkerGroup] = useState('');
  const [maxSlotsPerPhase, setMaxSlotsPerPhase] = useState(5);

  // Phase Window Rule State
  const [phaseWindowName, setPhaseWindowName] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [allowedPhases, setAllowedPhases] = useState<string[]>([]);
  const [phaseInput, setPhaseInput] = useState('');

  // Pattern Match Rule State
  const [patternMatchName, setPatternMatchName] = useState('');
  const [regex, setRegex] = useState('');
  const [template, setTemplate] = useState('');
  const [parameters, setParameters] = useState('{}');

  // Precedence Rule State
  const [precedenceName, setPrecedenceName] = useState('');
  const [scope, setScope] = useState<'global' | 'specific'>('global');
  const [targetRules, setTargetRules] = useState<string[]>([]);
  const [explicitOrder, setExplicitOrder] = useState(1);

  const ruleTypes = [
    { value: 'coRun', label: 'Co-Run Tasks', description: 'Select multiple tasks to run together' },
    { value: 'slotRestriction', label: 'Slot Restriction', description: 'Define minimum common slots for groups' },
    { value: 'loadLimit', label: 'Load Limit', description: 'Set maximum slots per phase for workers' },
    { value: 'phaseWindow', label: 'Phase Window', description: 'Define allowed phases for specific tasks' },
    { value: 'patternMatch', label: 'Pattern Match', description: 'Create rules based on regex patterns' },
    { value: 'precedence', label: 'Precedence Override', description: 'Define rule priority and execution order' }
  ];

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const addCoRunRule = () => {
    if (!coRunName || selectedTasks.length < 2) {
      toast({
        title: "Invalid Co-Run Rule",
        description: "Please provide a name and select at least 2 tasks.",
        variant: "destructive",
      });
      return;
    }

    const rule: CoRunRule = {
      id: Date.now().toString(),
      type: 'coRun',
      name: coRunName,
      tasks: [...selectedTasks],
      priority: rules.length + 1
    };

    setRules(prev => [...prev, rule]);
    setCoRunName('');
    setSelectedTasks([]);
    toast({
      title: "Co-Run Rule Added",
      description: `Rule "${coRunName}" created with ${selectedTasks.length} tasks.`,
    });
  };

  const addSlotRestrictionRule = () => {
    if (!slotRestrictionName || !targetGroup || minCommonSlots < 1) {
      toast({
        title: "Invalid Slot Restriction Rule",
        description: "Please provide all required fields.",
        variant: "destructive",
      });
      return;
    }

    const rule: SlotRestrictionRule = {
      id: Date.now().toString(),
      type: 'slotRestriction',
      name: slotRestrictionName,
      targetGroup,
      groupType,
      minCommonSlots,
      priority: rules.length + 1
    };

    setRules(prev => [...prev, rule]);
    setSlotRestrictionName('');
    setTargetGroup('');
    setMinCommonSlots(1);
    toast({
      title: "Slot Restriction Rule Added",
      description: `Rule "${slotRestrictionName}" created.`,
    });
  };

  const addLoadLimitRule = () => {
    if (!loadLimitName || !workerGroup || maxSlotsPerPhase < 1) {
      toast({
        title: "Invalid Load Limit Rule",
        description: "Please provide all required fields.",
        variant: "destructive",
      });
      return;
    }

    const rule: LoadLimitRule = {
      id: Date.now().toString(),
      type: 'loadLimit',
      name: loadLimitName,
      workerGroup,
      maxSlotsPerPhase,
      priority: rules.length + 1
    };

    setRules(prev => [...prev, rule]);
    setLoadLimitName('');
    setWorkerGroup('');
    setMaxSlotsPerPhase(5);
    toast({
      title: "Load Limit Rule Added",
      description: `Rule "${loadLimitName}" created.`,
    });
  };

  const addPhaseWindowRule = () => {
    if (!phaseWindowName || !selectedTaskId || allowedPhases.length === 0) {
      toast({
        title: "Invalid Phase Window Rule",
        description: "Please provide all required fields.",
        variant: "destructive",
      });
      return;
    }

    const rule: PhaseWindowRule = {
      id: Date.now().toString(),
      type: 'phaseWindow',
      name: phaseWindowName,
      taskId: selectedTaskId,
      allowedPhases: [...allowedPhases],
      priority: rules.length + 1
    };

    setRules(prev => [...prev, rule]);
    setPhaseWindowName('');
    setSelectedTaskId('');
    setAllowedPhases([]);
    toast({
      title: "Phase Window Rule Added",
      description: `Rule "${phaseWindowName}" created.`,
    });
  };

  const addPatternMatchRule = () => {
    if (!patternMatchName || !regex || !template) {
      toast({
        title: "Invalid Pattern Match Rule",
        description: "Please provide all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedParams = JSON.parse(parameters);
      const rule: PatternMatchRule = {
        id: Date.now().toString(),
        type: 'patternMatch',
        name: patternMatchName,
        regex,
        template,
        parameters: parsedParams,
        priority: rules.length + 1
      };

      setRules(prev => [...prev, rule]);
      setPatternMatchName('');
      setRegex('');
      setTemplate('');
      setParameters('{}');
      toast({
        title: "Pattern Match Rule Added",
        description: `Rule "${patternMatchName}" created.`,
      });
    } catch (error) {
      toast({
        title: "Invalid Parameters",
        description: "Please provide valid JSON for parameters.",
        variant: "destructive",
      });
    }
  };

  const addPrecedenceRule = () => {
    if (!precedenceName || targetRules.length === 0) {
      toast({
        title: "Invalid Precedence Rule",
        description: "Please provide a name and select target rules.",
        variant: "destructive",
      });
      return;
    }

    const rule: PrecedenceRule = {
      id: Date.now().toString(),
      type: 'precedence',
      name: precedenceName,
      scope,
      targetRules: [...targetRules],
      explicitOrder,
      priority: rules.length + 1
    };

    setRules(prev => [...prev, rule]);
    setPrecedenceName('');
    setTargetRules([]);
    setExplicitOrder(1);
    toast({
      title: "Precedence Rule Added",
      description: `Rule "${precedenceName}" created.`,
    });
  };

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Rule Removed",
      description: "Rule has been deleted successfully.",
    });
  };

  const addPhase = () => {
    if (phaseInput.trim() && !allowedPhases.includes(phaseInput.trim())) {
      setAllowedPhases(prev => [...prev, phaseInput.trim()]);
      setPhaseInput('');
    }
  };

  const removePhase = (phase: string) => {
    setAllowedPhases(prev => prev.filter(p => p !== phase));
  };

  const generateRulesConfig = () => {
    if (rules.length === 0) {
      toast({
        title: "No Rules to Export",
        description: "Please create at least one rule before generating the config.",
        variant: "destructive",
      });
      return;
    }

    const config = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      rules: rules.map(rule => ({
        ...rule,
        created: new Date().toISOString()
      })),
      metadata: {
        totalRules: rules.length,
        ruleTypes: [...new Set(rules.map(r => r.type))],
        generatedBy: "Data Alchemist Rules Builder"
      }
    };

    // In a real app, this would trigger a file download
    console.log('Generated Rules Config:', JSON.stringify(config, null, 2));
    onRulesGenerated(rules);
    
    toast({
      title: "Rules Config Generated!",
      description: `Successfully generated config with ${rules.length} rules. Check console for JSON output.`,
    });
  };

  const renderRuleForm = () => {
    switch (activeRuleType) {
      case 'coRun':
        return (
          <div className="space-y-4">
            <div>
              <Label className='my-2'>Rule Name</Label>
              <Input
                placeholder="Enter co-run rule name"
                value={coRunName}
                onChange={(e) => setCoRunName(e.target.value)}
              />
            </div>
            <div>
              <Label>Select Tasks (minimum 2)</Label>
              <Select onValueChange={(value) => {
                if (!selectedTasks.includes(value)) {
                  setSelectedTasks(prev => [...prev, value]);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose tasks to run together" />
                </SelectTrigger>
                <SelectContent>
                  {availableTaskIds.map(taskId => (
                    <SelectItem key={taskId} value={taskId}>{taskId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTasks.map(task => (
                  <Badge key={task} variant="secondary" className="cursor-pointer" onClick={() => 
                    setSelectedTasks(prev => prev.filter(t => t !== task))
                  }>
                    {task} ×
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={addCoRunRule} disabled={!coRunName || selectedTasks.length < 2}>
              <Plus className="h-4 w-4 mr-2" />
              Add Co-Run Rule
            </Button>
          </div>
        );

      case 'slotRestriction':
        return (
          <div className="space-y-4">
            <div>
              <Label className='my-2'>Rule Name</Label>
              <Input
                placeholder="Enter slot restriction rule name"
                value={slotRestrictionName}
                onChange={(e) => setSlotRestrictionName(e.target.value)}
              />
            </div>
            <div>
              <Label>Group Type</Label>
              <Select value={groupType} onValueChange={(value: 'client' | 'worker') => setGroupType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client Group</SelectItem>
                  <SelectItem value="worker">Worker Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Group</Label>
              <Select value={targetGroup} onValueChange={setTargetGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {(groupType === 'client' ? availableGroups.clients : availableGroups.workers).map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Minimum Common Slots</Label>
              <Input
                type="number"
                min="1"
                value={minCommonSlots}
                onChange={(e) => setMinCommonSlots(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={addSlotRestrictionRule} disabled={!slotRestrictionName || !targetGroup}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slot Restriction Rule
            </Button>
          </div>
        );

      case 'loadLimit':
        return (
          <div className="space-y-4">
            <div>
              <Label className='my-2'>Rule Name</Label>
              <Input
                placeholder="Enter load limit rule name"
                value={loadLimitName}
                onChange={(e) => setLoadLimitName(e.target.value)}
              />
            </div>
            <div>
              <Label>Worker Group</Label>
              <Select value={workerGroup} onValueChange={setWorkerGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select worker group" />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups.workers.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Maximum Slots Per Phase</Label>
              <Input
                type="number"
                min="1"
                value={maxSlotsPerPhase}
                onChange={(e) => setMaxSlotsPerPhase(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={addLoadLimitRule} disabled={!loadLimitName || !workerGroup}>
              <Plus className="h-4 w-4 mr-2" />
              Add Load Limit Rule
            </Button>
          </div>
        );

      case 'phaseWindow':
        return (
          <div className="space-y-4">
            <div>
              <Label className='my-2'>Rule Name</Label>
              <Input
                placeholder="Enter phase window rule name"
                value={phaseWindowName}
                onChange={(e) => setPhaseWindowName(e.target.value)}
              />
            </div>
            <div>
              <Label>Task ID</Label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {availableTaskIds.map(taskId => (
                    <SelectItem key={taskId} value={taskId}>{taskId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Allowed Phases</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter phase name"
                  value={phaseInput}
                  onChange={(e) => setPhaseInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPhase()}
                />
                <Button onClick={addPhase} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {allowedPhases.map(phase => (
                  <Badge key={phase} variant="secondary" className="cursor-pointer" onClick={() => removePhase(phase)}>
                    {phase} ×
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={addPhaseWindowRule} disabled={!phaseWindowName || !selectedTaskId || allowedPhases.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Phase Window Rule
            </Button>
          </div>
        );

      case 'patternMatch':
        return (
          <div className="space-y-4">
            <div>
              <Label className='my-2'>Rule Name</Label>
              <Input
                placeholder="Enter pattern match rule name"
                value={patternMatchName}
                onChange={(e) => setPatternMatchName(e.target.value)}
              />
            </div>
            <div>
              <Label>Regex Pattern</Label>
              <Input
                placeholder="Enter regex pattern (e.g., ^[A-Z]{3}-\d{4}$)"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
              />
            </div>
            <div>
              <Label>Rule Template</Label>
              <Input
                placeholder="Enter rule template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
            </div>
            <div>
              <Label>Parameters (JSON)</Label>
              <Textarea
                placeholder='{"param1": "value1", "param2": 123}'
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={addPatternMatchRule} disabled={!patternMatchName || !regex || !template}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pattern Match Rule
            </Button>
          </div>
        );

      case 'precedence':
        return (
          <div className="space-y-4">
            <div>
              <Label className='my-2'>Rule Name</Label>
              <Input
                placeholder="Enter precedence rule name"
                value={precedenceName}
                onChange={(e) => setPrecedenceName(e.target.value)}
              />
            </div>
            <div>
              <Label>Scope</Label>
              <Select value={scope} onValueChange={(value: 'global' | 'specific') => setScope(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="specific">Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Rules</Label>
              <Select onValueChange={(value) => {
                if (!targetRules.includes(value)) {
                  setTargetRules(prev => [...prev, value]);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rules to prioritize" />
                </SelectTrigger>
                <SelectContent>
                  {rules.map(rule => (
                    <SelectItem key={rule.id} value={rule.id}>{rule.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {targetRules.map(ruleId => {
                  const rule = rules.find(r => r.id === ruleId);
                  return rule ? (
                    <Badge key={ruleId} variant="secondary" className="cursor-pointer" onClick={() => 
                      setTargetRules(prev => prev.filter(id => id !== ruleId))
                    }>
                      {rule.name} ×
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
            <div>
              <Label>Explicit Order</Label>
              <Input
                type="number"
                min="1"
                value={explicitOrder}
                onChange={(e) => setExplicitOrder(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={addPrecedenceRule} disabled={!precedenceName || targetRules.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Precedence Rule
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Select a rule type above to start creating business rules.
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Business Rules Builder</span>
        </CardTitle>
        <p className="text-sm text-zinc-300">
          Create sophisticated business rules using an intuitive interface. Rules are automatically compiled into JSON configuration.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rule Type Selection */}
        <div>
          <Label className="text-base font-medium">Rule Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {ruleTypes.map(type => (
              <Card 
                key={type.value} 
                className={`p-3 cursor-pointer transition-colors ${
                  activeRuleType === type.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-[#212121]'
                }`}
                onClick={() => setActiveRuleType(type.value)}
              >
                <h4 className="font-medium text-sm">{type.label}</h4>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rule Creation Form */}
        <div>
          <h3 className="font-medium mb-4">
            {activeRuleType ? `Create ${ruleTypes.find(t => t.value === activeRuleType)?.label} Rule` : 'Select Rule Type'}
          </h3>
          {renderRuleForm()}
        </div>

        <Separator />

        {/* Active Rules */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Active Rules ({rules.length})</h3>
            {rules.length > 0 && (
              <Button onClick={generateRulesConfig} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Generate Rules Config
              </Button>
            )}
          </div>
          
          {rules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No rules created yet. Select a rule type above to get started.</p>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{rule.type}</Badge>
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant="secondary">Priority: {rule.priority}</Badge>
                      </div>
                      <div className="text-sm text-zinc-600 mt-1">
                        {rule.type === 'coRun' && `Tasks: ${rule.tasks.join(', ')}`}
                        {rule.type === 'slotRestriction' && `${rule.groupType} group "${rule.targetGroup}" - Min ${rule.minCommonSlots} slots`}
                        {rule.type === 'loadLimit' && `Worker group "${rule.workerGroup}" - Max ${rule.maxSlotsPerPhase} slots/phase`}
                        {rule.type === 'phaseWindow' && `Task "${rule.taskId}" - Phases: ${rule.allowedPhases.join(', ')}`}
                        {rule.type === 'patternMatch' && `Pattern: ${rule.regex} - Template: ${rule.template}`}
                        {rule.type === 'precedence' && `${rule.scope} scope - Order: ${rule.explicitOrder}`}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleInputUI;
