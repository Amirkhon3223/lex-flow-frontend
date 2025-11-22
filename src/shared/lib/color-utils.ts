export function getIconBgColor(iconColor: string): string {
  const colorMap: Record<string, string> = {
    'text-blue-500': 'bg-blue-50 dark:bg-muted',
    'text-blue-600': 'bg-blue-50 dark:bg-muted',
    'text-green-500': 'bg-green-50 dark:bg-muted',
    'text-green-600': 'bg-green-50 dark:bg-muted',
    'text-purple-500': 'bg-purple-50 dark:bg-muted',
    'text-purple-600': 'bg-purple-50 dark:bg-muted',
    'text-orange-500': 'bg-orange-50 dark:bg-muted',
    'text-orange-600': 'bg-orange-50 dark:bg-muted',
    'text-red-500': 'bg-red-50 dark:bg-muted',
    'text-red-600': 'bg-red-50 dark:bg-muted',
    'text-amber-500': 'bg-amber-50 dark:bg-muted',
    'text-amber-600': 'bg-amber-50 dark:bg-muted',
    'text-yellow-500': 'bg-yellow-50 dark:bg-muted',
    'text-yellow-600': 'bg-yellow-50 dark:bg-muted',
    'text-muted-foreground': 'bg-muted',
  };
  return colorMap[iconColor] || 'bg-primary/10';
}
