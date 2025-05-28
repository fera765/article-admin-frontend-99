
import React, { Suspense, lazy } from 'react';
import { Label } from '@/components/ui/label';

const ReactQuill = lazy(() => import('react-quill'));

interface LazyRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const LazyRichTextEditor: React.FC<LazyRichTextEditorProps> = (props) => {
  return (
    <div className="space-y-2">
      <Label>{props.label || 'Conteúdo'} *</Label>
      <Suspense fallback={
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Carregando editor...</div>
        </div>
      }>
        <ReactQuillWrapper {...props} />
      </Suspense>
    </div>
  );
};

const ReactQuillWrapper: React.FC<LazyRichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Digite o conteúdo completo do artigo",
  label = "Conteúdo" 
}) => {
  // Lazy import will only load the actual RichTextEditor when needed
  const RichTextEditor = lazy(() => import('./RichTextEditor'));
  
  return (
    <Suspense fallback={
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="text-gray-500">Inicializando editor...</div>
      </div>
    }>
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        label={label}
      />
    </Suspense>
  );
};

export default LazyRichTextEditor;
