import { useId } from 'react';
import { useSelectContext } from '@/shared/context/SelectContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface ManagedSelectProps extends React.ComponentProps<typeof Select> {
  children: React.ReactNode;
}

export function ManagedSelect({ children, open: controlledOpen, onOpenChange, ...props }: ManagedSelectProps) {
  const selectId = useId();
  const { openSelectId, setOpenSelectId } = useSelectContext();

  const isOpen = controlledOpen !== undefined ? controlledOpen : openSelectId === selectId;

  const handleOpenChange = (newOpen: boolean) => {
    setOpenSelectId(newOpen ? selectId : null);
    onOpenChange?.(newOpen);
  };

  return (
    <Select {...props} open={isOpen} onOpenChange={handleOpenChange}>
      {children}
    </Select>
  );
}

export { SelectContent, SelectItem, SelectTrigger, SelectValue };
