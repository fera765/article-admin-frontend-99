
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface Editor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor';
  status: 'active';
  createdAt: string;
  updatedAt: string;
}

interface AuthorSelectProps {
  value: string;
  onChange: (authorName: string) => void;
  label?: string;
}

const AuthorSelect: React.FC<AuthorSelectProps> = ({ 
  value, 
  onChange, 
  label = "Autor" 
}) => {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEditors();
  }, []);

  const loadEditors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/editors');
      setEditors(response || []);
    } catch (error) {
      console.error('Error loading editors:', error);
      toast({
        title: 'Erro ao carregar editores',
        description: 'Não foi possível carregar a lista de editores.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const options = editors.map(editor => ({
    value: editor.name,
    label: `${editor.name} (${editor.email})`,
  }));

  const selectedOption = options.find(option => option.value === value);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '40px',
      borderColor: '#e2e8f0',
      '&:hover': {
        borderColor: '#cbd5e1',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#94a3b8',
    }),
  };

  return (
    <div className="space-y-2">
      <Label>{label} *</Label>
      <Select
        value={selectedOption}
        onChange={(option) => onChange(option?.value || '')}
        options={options}
        placeholder="Selecione um autor..."
        isLoading={loading}
        isClearable
        isSearchable
        styles={customStyles}
        noOptionsMessage={() => 'Nenhum editor encontrado'}
        loadingMessage={() => 'Carregando editores...'}
      />
    </div>
  );
};

export default AuthorSelect;
