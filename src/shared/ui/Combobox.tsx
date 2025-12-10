import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/shared/ui/input.tsx';

interface ComboboxOption {
  label: string;
  value: string;
  icon?: string;
}

interface ComboboxProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  options: ComboboxOption[];
  onChange: (value: string) => void;
  renderIcon?: boolean;
  errorText?: string;
  iconWidth?: number;
  iconHeight?: number;
}

export function Combobox({
  value,
  placeholder,
  disabled,
  options,
  onChange,
  renderIcon = false,
  errorText,
  iconWidth = 24,
  iconHeight = 20,
}: ComboboxProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((o) => o.value === value);
    setInputValue(selected ? selected.label : '');
  }, [value, options]);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase()));

  const selectOption = (val: string) => {
    onChange(val);
    const selected = options.find((o) => o.value === val);
    setInputValue(selected ? selected.label : '');
    setIsOpen(false);
  };

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', esc);

    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Input
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="pr-10"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Ничего не найдено</div>
          ) : (
            filtered.map((o) => {
              const selected = o.value === value;

              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => selectOption(o.value)}
                  className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent transition ${
                    selected ? 'bg-accent font-medium' : ''
                  }`}
                >
                  {renderIcon && o.icon && (
                    <img
                      src={o.icon}
                      className=""
                      style={{ width: iconWidth, height: iconHeight }}
                      alt=""
                    />
                  )}
                  {o.label}
                </button>
              );
            })
          )}
        </div>
      )}

      {errorText && <small className="text-red-500 text-xs">{errorText}</small>}
    </div>
  );
}
