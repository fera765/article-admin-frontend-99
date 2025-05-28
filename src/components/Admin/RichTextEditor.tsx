
import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/quill-custom.css';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Digite o conteúdo completo do artigo",
  label = "Conteúdo" 
}) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    // Ensure Quill is properly initialized
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.root.setAttribute('data-placeholder', placeholder);
    }
  }, [placeholder]);

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
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
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              const imageUrl = `${apiClient.baseURL}${data.url}`;
              quill.insertEmbed(range?.index || 0, 'image', imageUrl);
            }
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
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'align'
  ];

  return (
    <div className="space-y-2">
      <Label>{label} *</Label>
      <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ 
            minHeight: '250px',
            backgroundColor: 'white'
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
