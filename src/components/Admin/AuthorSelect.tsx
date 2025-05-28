
import React from 'react';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import { useEditors } from '@/hooks/useEditors';

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
  const { data: editors = [], isLoading } = useEditors();

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
        isLoading={isLoading}
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
