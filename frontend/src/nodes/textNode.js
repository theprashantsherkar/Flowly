import { useMemo, useRef, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { TextAreaField } from './NodeFields';
import { useNodeField } from './useNodeField';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  let match;
  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
};

export const TextNode = ({ id, data }) => {
  const [text, setText] = useNodeField(id, 'text', data?.text ?? '{{input}}');
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(text), [text]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const width = useMemo(() => {
    const longestLine = text.split('\n').reduce((max, line) => Math.max(max, line.length), 0);
    return Math.min(480, Math.max(220, longestLine * 8 + 60));
  }, [text]);

  const minHeight = variables.length > 1 ? variables.length * 26 + 90 : undefined;

  const variableHandles = variables.map((name) => ({
    id: `${id}-var-${name}`,
    type: 'target',
    position: Position.Left,
  }));

  return (
    <BaseNode
      title="Text"
      icon="📝"
      accent="bg-sky-600"
      handles={[...variableHandles, { id: `${id}-output`, type: 'source', position: Position.Right }]}
      style={{ width, minHeight }}
    >
      {variables.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {variables.map((name) => (
            <span
              key={name}
              className="rounded bg-panelLight px-1.5 py-0.5 text-[10px] font-medium text-indigo-300"
            >
              {name}
            </span>
          ))}
        </div>
      )}
      <TextAreaField
        label="Text"
        value={text}
        onChange={setText}
        textareaRef={textareaRef}
        placeholder="Type text, use {{ variable }} to add inputs"
      />
    </BaseNode>
  );
};
