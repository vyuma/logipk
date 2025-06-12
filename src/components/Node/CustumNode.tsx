import { useCallback, useRef, useEffect, type ChangeEvent } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

type Props = {
  id: string;
  data: { label: string };
  onLabelChange: (id: string, value: string) => void;
};

function TextUpdaterNode({ id, data, onLabelChange }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 入力時に高さを合わせて伸ばし、ラベルも更新
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    onLabelChange(id, el.value);
  }, [id, onLabelChange]);

  // 初期レンダリングやラベル変更時にも高さを調整
  useEffect(() => {
    const el = taRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [data.label]);

  return (
<div className="w-full rounded-lg bg-gray-800 p-2 shadow-md">
  <Handle type="target" position={Position.Top} />
  <textarea
    ref={taRef}
    className="mt-1 w-full resize-none overflow-hidden rounded-md border border-gray-600 bg-gray-900 text-gray-100 p-2 text-sm focus:outline-none"
    placeholder="Type here..."
    value={data.label}
    onChange={handleChange}
  />
  <Handle type="source" position={Position.Bottom} id="a" />
  <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
</div>

  );
}

export default TextUpdaterNode;
