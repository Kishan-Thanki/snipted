'use client';

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
}

const languageOptions = [
  'javascript', 'typescript', 'python', 'java', 'cpp',
  'csharp', 'go', 'rust', 'php', 'ruby', 'swift',
  'html', 'css', 'sql', 'json', 'yaml', 'markdown'
];

export function CodeEditor({
  value,
  onChange,
  language,
  height = '400px',
  readOnly = false,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => onChange({ target: { name: 'language', value: e.target.value } })}
            className="px-3 py-1 border rounded-md text-sm"
            disabled={readOnly}
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {value.length} characters
          </span>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Editor
          height={height}
          language={language}
          value={value}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            readOnly,
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}