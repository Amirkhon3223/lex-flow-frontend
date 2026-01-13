export function RussiaFlag({ className = "w-5 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#fff"/>
      <rect width="900" height="200" y="200" fill="#0039a6"/>
      <rect width="900" height="200" y="400" fill="#d52b1e"/>
    </svg>
  );
}
