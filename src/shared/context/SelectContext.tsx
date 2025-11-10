import { createContext, useContext, useState, type ReactNode } from 'react';

interface SelectContextType {
  openSelectId: string | null;
  setOpenSelectId: (id: string | null) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export function SelectProvider({ children }: { children: ReactNode }) {
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  return (
    <SelectContext.Provider value={{ openSelectId, setOpenSelectId }}>
      {children}
    </SelectContext.Provider>
  );
}

export function useSelectContext() {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error('useSelectContext must be used within a SelectProvider');
  }
  return context;
}
