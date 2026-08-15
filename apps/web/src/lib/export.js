import { toPng, toSvg } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from 'reactflow';
import { jsPDF } from 'jspdf';

const WIDTH = 1600;
const HEIGHT = 1200;
const BG = '#0f1420';

function triggerDownload(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

// Renders the ReactFlow viewport, framed to fit all nodes, via html-to-image.
async function renderViewport(nodes, renderer) {
  const viewport = document.querySelector('.react-flow__viewport');
  if (!viewport || nodes.length === 0) return null;
  const bounds = getNodesBounds(nodes);
  const tf = getViewportForBounds(bounds, WIDTH, HEIGHT, 0.2, 2, 0.15);
  return renderer(viewport, {
    backgroundColor: BG,
    width: WIDTH,
    height: HEIGHT,
    style: {
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
      transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.zoom})`,
    },
  });
}

export async function exportPng(nodes, name) {
  const url = await renderViewport(nodes, toPng);
  if (url) triggerDownload(url, `${name}.png`);
}

export async function exportSvg(nodes, name) {
  const url = await renderViewport(nodes, toSvg);
  if (url) triggerDownload(url, `${name}.svg`);
}

export async function exportPdf(nodes, name) {
  const url = await renderViewport(nodes, toPng);
  if (!url) return;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [WIDTH, HEIGHT] });
  pdf.addImage(url, 'PNG', 0, 0, WIDTH, HEIGHT);
  pdf.save(`${name}.pdf`);
}

export function exportJson(nodes, edges, name) {
  const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${name}.json`);
  URL.revokeObjectURL(url);
}

const safeName = (title) => (title || 'flowly-flow').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();

export async function exportFlow(format, { nodes, edges, title }) {
  const name = safeName(title);
  if (format === 'png') return exportPng(nodes, name);
  if (format === 'svg') return exportSvg(nodes, name);
  if (format === 'pdf') return exportPdf(nodes, name);
  if (format === 'json') return exportJson(nodes, edges, name);
  return undefined;
}
