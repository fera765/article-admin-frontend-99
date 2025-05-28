
import React, { useRef, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import '../../styles/quill-custom.css';
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

  // useEffect(() => {
  //   if (quillRef.current) {
  //     const quill = quillRef.current.getEditor();
  //     quill.root.setAttribute('data-placeholder', placeholder);
  //   }
  // }, [placeholder]);

  // const imageHandler = async () => {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //   input.click();

  //   input.onchange = async () => {
  //     const file = input.files?.[0];
  //     if (file) {
  //       try {
  //         const formData = new FormData();
  //         formData.append('image', file);

  //         const response = await fetch(`${apiClient.baseURL}/upload`, {
  //           method: 'POST',
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //           body: formData,
  //         });

  //         if (response.ok) {
  //           const data = await response.json();
  //           const quill = quillRef.current?.getEditor();
  //           if (quill) {
  //             const range = quill.getSelection();
  //             const imageUrl = `${apiClient.baseURL}${data.url}`;
  //             quill.insertEmbed(range?.index || 0, 'image', imageUrl);
  //           }
  //           toast({
  //             title: 'Imagem enviada com sucesso!',
  //             description: 'A imagem foi inserida no editor.',
  //           });
  //         } else {
  //           throw new Error('Falha no upload');
  //         }
  //       } catch (error) {
  //         console.error('Error uploading image:', error);
  //         toast({
  //           title: 'Erro no upload da imagem',
  //           description: 'Tente novamente.',
  //           variant: 'destructive',
  //         });
  //       }
  //     }
  //   };
  // };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      // handlers: {
      //   image: imageHandler,
      // },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'align',
    'color', 'background', 'blockquote', 'code-block'
  ];

  // Usar useCallback para evitar re-criação da função a cada render
  const handleChange = useCallback((content: string) => {
    console.log('RichTextEditor handleChange called with:', content?.length, 'characters');
    
    // Evitar processamento desnecessário se o conteúdo não mudou realmente
    if (content === value) {
      console.log('Content unchanged, skipping update');
      return;
    }
    
    // Limpar parágrafos vazios mas manter estrutura adequada
    const cleanContent = content === '<p><br></p>' ? '' : content;
    console.log('Calling onChange with cleaned content');
    onChange(cleanContent);
  }, [onChange, value]);

  // Log para debug
  console.log('RichTextEditor render - value length:', value?.length || 0);

  return (
    <div className="space-y-2">
      <Label htmlFor="content-editor">{label} *</Label>
      <div className="bg-white border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ 
            minHeight: '300px',
            backgroundColor: 'white'
          }}
        />
      </div>
      {!value && (
        <p className="text-sm text-gray-500 mt-1">
          Este campo é obrigatório
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;
