import { undefined } from 'zod';
import { TagField, TextField } from '../components';
import { PRIORITY } from '../models/enum/priority.enum';

export const handlePriority = (priority: number, onlyValue?: boolean) => {
  switch (priority) {
    case PRIORITY.LOW:
      return typeof onlyValue !== 'undefined' && onlyValue ? 'Baixa' : <TagField value="Baixa" color="#62C450" />;
    case PRIORITY.NORMAL:
      return typeof onlyValue !== 'undefined' && onlyValue ? 'Normal' : <TagField value="Normal" color="#FFD827" />;
    case PRIORITY.HIGH:
      return typeof onlyValue !== 'undefined' && onlyValue ? 'Alta' : <TagField value="Alta" color="#F78D37" />;
    case PRIORITY.CRITICAL:
      return typeof onlyValue !== 'undefined' && onlyValue ? 'Crítica' : <TagField value="Crítica" color="#D42A34" />;

    default:
      return typeof onlyValue !== 'undefined' && onlyValue ? '-' : <TextField value="-" />;
  }
};

export const handleTextPriority = (priority: string) => {
  switch (priority) {
    case 'Baixa':
      return PRIORITY.LOW;
    case 'Normal':
      return PRIORITY.NORMAL;
    case 'Alta':
      return PRIORITY.HIGH;
    case 'Crítica':
      return PRIORITY.CRITICAL;
    default:
      return undefined;
  }
};
