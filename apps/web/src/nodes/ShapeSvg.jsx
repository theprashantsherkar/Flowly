/**
 * Renders a flowchart shape as a stretchable SVG. viewBox is a fixed 100x100 with
 * preserveAspectRatio="none" so the shape fills whatever size the node is resized
 * to, while vector-effect keeps the stroke a constant width.
 */
export function ShapeSvg({ shape, stroke = '#6366f1', fill = 'rgba(99,102,241,0.14)', strokeWidth = 2 }) {
  const common = {
    fill,
    stroke,
    strokeWidth,
    vectorEffect: 'non-scaling-stroke',
    strokeLinejoin: 'round',
  };
  const line = {
    fill: 'none',
    stroke,
    strokeWidth,
    vectorEffect: 'non-scaling-stroke',
  };

  let body = null;
  switch (shape) {
    case 'process':
      body = <rect x="2" y="2" width="96" height="96" rx="5" {...common} />;
      break;
    case 'decision':
      body = <polygon points="50,2 98,50 50,98 2,50" {...common} />;
      break;
    case 'terminator':
      body = <rect x="2" y="2" width="96" height="96" rx="40" {...common} />;
      break;
    case 'data':
      body = <polygon points="22,2 98,2 78,98 2,98" {...common} />;
      break;
    case 'preparation':
      body = <polygon points="24,2 76,2 98,50 76,98 24,98 2,50" {...common} />;
      break;
    case 'connector':
      body = <ellipse cx="50" cy="50" rx="47" ry="47" {...common} />;
      break;
    case 'document':
      body = <path d="M2,2 L98,2 L98,82 C74,101 26,67 2,82 Z" {...common} />;
      break;
    case 'database':
      body = (
        <>
          <path d="M2,14 C2,6 98,6 98,14 L98,86 C98,94 2,94 2,86 Z" {...common} />
          <path d="M2,14 C2,22 98,22 98,14" {...line} />
        </>
      );
      break;
    case 'note':
      body = (
        <>
          <path d="M2,2 L82,2 L98,18 L98,98 L2,98 Z" {...common} />
          <path d="M82,2 L82,18 L98,18" {...line} />
        </>
      );
      break;
    default:
      body = null;
  }

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      {body}
    </svg>
  );
}
