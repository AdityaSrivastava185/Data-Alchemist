"use client"
import React, { useState } from 'react';
import { Search, Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface DataRow {
  id: string;
  [key: string]: any;
}

interface NaturalLanguageQueryProps {
  allData: DataRow[];
  onFilteredData: (data: DataRow[], query: string) => void;
}

const NaturalLanguageQuery: React.FC<NaturalLanguageQueryProps> = ({ 
  allData, 
  onFilteredData 
}) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('openai-api-key', value);
  };

  const generateFilterLogic = async (userQuery: string, sampleData: any) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use natural language queries.",
        variant: "destructive",
      });
      return null;
    }

    const prompt = `Given this data structure and user query, generate JavaScript filter logic.

Sample data fields: ${JSON.stringify(Object.keys(sampleData), null, 2)}
Sample record: ${JSON.stringify(sampleData, null, 2)}

User query: "${userQuery}"

Generate a JavaScript function that filters the data based on the user's natural language query. Return ONLY the JavaScript filter function code that can be used with Array.filter(). The function should receive a 'row' parameter representing each data record.

Example format:
(row) => {
  // filter logic here
  return true/false;
}

Make the filtering case-insensitive and handle partial matches where appropriate. Handle various field types (strings, numbers, dates, etc.) appropriately.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const generatedCode = data.choices?.[0]?.message?.content;
      
      if (!generatedCode) {
        throw new Error('No response from AI');
      }

      // Extract just the function code, removing markdown formatting
      const cleanCode = generatedCode.replace(/```javascript|```js|```/g, '').trim();
      
      return cleanCode;
    } catch (error) {
      console.error('Error generating filter logic:', error);
      throw error;
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query to search your data.",
        variant: "destructive",
      });
      return;
    }

    if (allData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload some data first before querying.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const sampleData = allData[0];
      const filterFunction = await generateFilterLogic(query, sampleData);
      
      if (!filterFunction) {
        return;
      }

      // Create and execute the filter function with proper error handling
      const filterFn = new Function('row', `
        try {
          return ${filterFunction};
        } catch (error) {
          console.error('Filter execution error:', error);
          return false;
        }
      `) as (row: DataRow) => boolean;
      
      const filteredData = allData.filter((row: DataRow) => {
        try {
          return filterFn(row);
        } catch (error) {
          console.error('Error filtering row:', error);
          return false;
        }
      });
      
      setLastQuery(query);
      onFilteredData(filteredData, query);
      
      toast({
        title: "Query Executed",
        description: `Found ${filteredData.length} matching records for: "${query}"`,
      });
      
    } catch (error) {
      console.error('Query error:', error);
      toast({
        title: "Query Failed",
        description: error instanceof Error ? error.message : "Failed to process your query. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilter = () => {
    onFilteredData(allData, '');
    setLastQuery('');
    setQuery('');
    toast({
      title: "Filter Cleared",
      description: "Showing all data records.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Natural Language Data Query</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openai-api-key">OpenAI API Key</Label>
          <Input
            id="openai-api-key"
            type="password"
            placeholder="Enter your OpenAI API key (sk-...)..."
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Your API key is stored locally and used only for processing your queries.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="query">Ask about your data</Label>
          <Textarea
            id="query"
            placeholder="e.g., 'Show me all clients from New York', 'Find workers with high priority tasks', 'Show incomplete tasks from last month'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleQuery} 
            disabled={isLoading || !query.trim() || !apiKey.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Query Data
              </>
            )}
          </Button>
          
          {lastQuery && (
            <Button variant="outline" onClick={handleClearFilter}>
              <Database className="h-4 w-4 mr-2" />
              Show All
            </Button>
          )}
        </div>

        {lastQuery && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Current filter:</strong> {lastQuery}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NaturalLanguageQuery;
