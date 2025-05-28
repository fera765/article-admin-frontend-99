
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, placeholder }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[data-markdown-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), tooltip: 'Negrito' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), tooltip: 'Itálico' },
    { icon: Heading1, action: () => insertMarkdown('# '), tooltip: 'Título 1' },
    { icon: Heading2, action: () => insertMarkdown('## '), tooltip: 'Título 2' },
    { icon: Heading3, action: () => insertMarkdown('### '), tooltip: 'Título 3' },
    { icon: List, action: () => insertMarkdown('- '), tooltip: 'Lista' },
    { icon: ListOrdered, action: () => insertMarkdown('1. '), tooltip: 'Lista Numerada' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), tooltip: 'Link' },
    { icon: Quote, action: () => insertMarkdown('> '), tooltip: 'Citação' },
    { icon: Code, action: () => insertMarkdown('`', '`'), tooltip: 'Código' },
  ];

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex flex-wrap gap-1">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.tooltip}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as 'write' | 'preview')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Escrever</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="p-4">
            <Textarea
              data-markdown-editor
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[300px] resize-none border-0 focus-visible:ring-0"
            />
          </TabsContent>
          <TabsContent value="preview" className="p-4">
            <div 
              className="min-h-[300px] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:grid md:grid-cols-2">
        <div className="p-4 border-r">
          <Textarea
            data-markdown-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] resize-none border-0 focus-visible:ring-0"
          />
        </div>
        <div className="p-4">
          <div 
            className="min-h-[400px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
