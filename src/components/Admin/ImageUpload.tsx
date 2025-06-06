
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Imagem" }) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploading(true);
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
          onChange(data.url);
          setUrlInput(data.url);
          toast({
            title: 'Upload concluído!',
            description: 'A imagem foi enviada com sucesso.',
          });
        } else {
          throw new Error('Falha no upload');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Erro no upload',
          description: 'Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
  });

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="https://exemplo.com/imagem.jpg"
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
        {value && (
          <Button type="button" variant="outline" size="sm" onClick={clearImage}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {uploading
            ? 'Enviando...'
            : isDragActive
            ? 'Solte a imagem aqui'
            : 'Arraste uma imagem ou clique para selecionar'
          }
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 10MB</p>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <Label className="text-sm text-gray-600">Prévia:</Label>
          <div className="mt-2 relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="max-w-64 max-h-48 object-cover rounded-lg border"
              onError={() => {
                toast({
                  title: 'Erro ao carregar imagem',
                  description: 'Verifique se a URL está correta.',
                  variant: 'destructive',
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
