import { Button } from '@/shared/ui/button.tsx';

export function PageFooter() {
  return (
    <div className="text-center mt-6 sm:mt-8">
      <p className="text-xs sm:text-sm text-slate-600">
        © 2025 LexFlow. Все права защищены.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-2.5 sm:mt-3">
        <Button variant="ghost" className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2">
          Помощь
        </Button>
        <Button variant="ghost" className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2">
          Контакты
        </Button>
        <Button variant="ghost" className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2">
          Приватность
        </Button>
      </div>
    </div>
  );
}
