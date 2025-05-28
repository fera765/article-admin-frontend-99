
import React from 'react';
import DatePicker from 'react-datepicker';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ 
  value, 
  onChange, 
  label = "Data de Publicação",
  placeholder = "Selecione a data e hora"
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <DatePicker
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          placeholderText={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          calendarClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default DateTimePicker;
