
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface Author {
  id: string;
  name: string;
  email: string;
  role: string;
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
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users?role=admin,editor');
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Error loading authors:', error);
      toast({
        title: 'Erro ao carregar autores',
        description: 'Não foi possível carregar a lista de autores.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const options = authors.map(author => ({
    value: author.name,
    label: `${author.name} (${author.email})`,
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
      <Label>{label}</Label>
      <Select
        value={selectedOption}
        onChange={(option) => onChange(option?.value || '')}
        options={options}
        placeholder="Selecione um autor..."
        isLoading={loading}
        isClearable
        isSearchable
        styles={customStyles}
        noOptionsMessage={() => 'Nenhum autor encontrado'}
        loadingMessage={() => 'Carregando autores...'}
      />
    </div>
  );
};

export default AuthorSelect;
