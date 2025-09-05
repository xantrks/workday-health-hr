'''use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

export default function AiInsightsPage() {
  const [apiKey, setApiKey] = useState('');

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ai-api-key', apiKey);
      toast.success('API Key saved!');
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <PageHeader>
        <PageHeaderHeading>AI Insights</PageHeaderHeading>
        <PageHeaderDescription>
          Enter your API key to get AI-powered insights.
        </PageHeaderDescription>
      </PageHeader>

      <div className="mt-8">
        <div className="flex items-center gap-4">
          <Label htmlFor="api-key" className="whitespace-nowrap">
            API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSaveApiKey}>Save</Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Dummy Data</h2>
        <p className="mt-4">Here is some dummy data to show what the AI insights will look like:</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="font-semibold">Insight 1</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a dummy insight. Replace this with real data once the API key is provided.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="font-semibold">Insight 2</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is another dummy insight. Replace this with real data once the API key is provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
''' 