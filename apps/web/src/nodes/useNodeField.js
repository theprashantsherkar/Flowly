import { useState } from 'react';
import { useStore } from '../store';

export const useNodeField = (id, field, initial) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [value, setValue] = useState(initial);

  const onChange = (next) => {
    setValue(next);
    updateNodeField(id, field, next);
  };

  return [value, onChange];
};
