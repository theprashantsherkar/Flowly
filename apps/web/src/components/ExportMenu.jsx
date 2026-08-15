import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { Download } from 'lucide-react';
import { useStore } from '../store';
import { exportFlow } from '../lib/export';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const FORMATS = [
  ['png', 'PNG image'],
  ['svg', 'SVG vector'],
  ['pdf', 'PDF document'],
  ['json', 'JSON data'],
];

const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

export function ExportMenu({ title }) {
  const { nodes, edges } = useStore(selector, shallow);
  const [busy, setBusy] = useState(false);

  const run = async (format) => {
    setBusy(true);
    try {
      await exportFlow(format, { nodes, edges, title });
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" disabled={busy}>
          <Download size={15} /> {busy ? 'Exporting…' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {FORMATS.map(([format, label]) => (
          <DropdownMenuItem key={format} onSelect={() => run(format)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
