
import React, { useRef, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link2, Image, Type } from 'lucide-react';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  label = "Conteúdo",
  placeholder = "Digite o conteúdo do artigo..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(300, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${apiClient.baseURL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = `${apiClient.baseURL}${data.url}`;
          insertText(`![Imagem](${imageUrl})`);
          
          toast({
            title: 'Imagem enviada com sucesso!',
            description: 'A imagem foi inserida no editor.',
          });
        } else {
          throw new Error('Falha no upload');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Erro no upload da imagem',
          description: 'Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), tooltip: 'Negrito' },
    { icon: Italic, action: () => insertText('*', '*'), tooltip: 'Itálico' },
    { icon: Type, action: () => insertText('# '), tooltip: 'Título' },
    { icon: List, action: () => insertText('- '), tooltip: 'Lista' },
    { icon: Link2, action: () => insertText('[texto](url)'), tooltip: 'Link' },
    { icon: Image, action: handleImageUpload, tooltip: 'Imagem', loading: isUploading },
  ];

  return (
    <div className="space-y-2">
      <Label>{label} *</Label>
      
      <div className="border border-input rounded-md overflow-hidden bg-background">
        {/* Toolbar */}
        <div className="border-b border-input p-2 bg-muted/30">
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                disabled={button.loading}
                className="h-8 w-8 p-0"
                title={button.tooltip}
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] max-h-[500px] border-0 focus-visible:ring-0 resize-none"
          style={{ height: '300px' }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Use Markdown para formatação: **negrito**, *itálico*, # título, - lista
      </p>
    </div>
  );
};

export default TextEditor;
