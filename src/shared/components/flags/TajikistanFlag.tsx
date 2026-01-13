export function TajikistanFlag({ className = "w-5 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#006600"/>
      <rect width="600" height="200" fill="#fff"/>
      <rect width="600" height="100" fill="#cc0000"/>
      <g transform="translate(300,150)">
        {/* Crown */}
        <path d="M0,-40 L-8,-30 L-5,-30 L-5,-20 L5,-20 L5,-30 L8,-30 Z" fill="#f8c300"/>
        <circle cx="-8" cy="-30" r="2" fill="#f8c300"/>
        <circle cx="0" cy="-35" r="2" fill="#f8c300"/>
        <circle cx="8" cy="-30" r="2" fill="#f8c300"/>
        {/* Stars */}
        <g transform="translate(-40,0)">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#f8c300"/>
        </g>
        <g transform="translate(-20,0)">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#f8c300"/>
        </g>
        <g transform="translate(0,0)">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#f8c300"/>
        </g>
        <g transform="translate(20,0)">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#f8c300"/>
        </g>
        <g transform="translate(40,0)">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#f8c300"/>
        </g>
      </g>
    </svg>
  );
}
