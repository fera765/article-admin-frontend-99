
import React, { useState, KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImprovedTagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

const ImprovedTagsInput: React.FC<ImprovedTagsInputProps> = ({ 
  value = [], 
  onChange, 
  label = "Tags",
  placeholder = "Digite uma tag"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      e.preventDefault();
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleAddClick = () => {
    addTag();
    if (!isMobile) {
      inputRef.current?.focus();
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    // No mobile, don't auto-add tag on blur to avoid keyboard issues
    if (!isMobile && inputValue.trim()) {
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Input with Add Button */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="flex-1"
          autoComplete="off"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddClick}
          disabled={!inputValue.trim() || value.includes(inputValue.trim())}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Instructions */}
      {isMobile && isInputFocused && (
        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
          Pressione o botão + para adicionar a tag
        </p>
      )}

      {/* Tags Display */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 text-sm py-1">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 focus:outline-none"
                  aria-label={`Remover tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            {value.length} tag{value.length !== 1 ? 's' : ''} adicionada{value.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovedTagsInput;
