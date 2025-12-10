import { Scale } from 'lucide-react';

export function BrandHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-3 sm:mb-4">
        <Scale className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-accent-foreground mb-1.5 sm:mb-2">
        LexFlow
      </h1>
      <p className="text-sm sm:text-base text-secondary-foreground px-4">
        Платформа управления для юридических практик
      </p>
    </div>
  );
}
