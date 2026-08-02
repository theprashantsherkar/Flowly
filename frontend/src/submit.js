import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const { num_nodes, num_edges, is_dag } = await response.json();

      alert(
        `Pipeline submitted!\n\n` +
          `Nodes: ${num_nodes}\n` +
          `Edges: ${num_edges}\n` +
          `Valid DAG: ${is_dag ? 'Yes' : 'No'}`
      );
    } catch (err) {
      alert(`Could not reach the backend.\n\n${err.message}\n\nIs it running on http://localhost:8000?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-panel py-5">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={
          'cursor-pointer rounded-lg bg-accent px-6 py-2.5 font-semibold text-white ' +
          'shadow-node transition hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-60'
        }
      >
        {loading ? 'Submitting…' : 'Submit Pipeline'}
      </button>
    </div>
  );
};
