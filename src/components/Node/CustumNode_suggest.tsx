import { useCallback, useRef, useEffect, type ChangeEvent } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

type Props = {
  id: string;
  data: { label: string };
  onLabelChange: (id: string, value: string) => void;
  selected?: boolean;
};

function TextSuggestNode({ id, data, onLabelChange, selected }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  /* ──（編集不可だが将来拡張用に）高さ自動調整ロジック── */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      onLabelChange(id, el.value); // disabled のため今回は発火しない
    },
    [id, onLabelChange],
  );

  useEffect(() => {
    const el = taRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [data.label]);

  return (
    <div
      className={`
        relative w-full rounded-lg border-2 p-3 transition-all
        bg-gray-900/30 opacity-80 backdrop-blur-md backdrop-saturate-150
        ${selected ? 'border-blue-500 shadow-[0_0_12px_2px_#3b82f6]' : 'border-transparent'}
      `}
    >
      {/* ── Handles & textarea ── */}
      <Handle type="target" position={Position.Top} />

      <textarea
        ref={taRef}
        className="
          mt-1 w-full resize-none overflow-hidden rounded-md border
          border-green-400/40 bg-transparent p-2 text-sm text-gray-100
          placeholder-gray-400 outline-none
        "
        placeholder="サジェスト内容"
        value={data.label}
        onChange={handleChange}
        rows={1}
      />

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}

export default TextSuggestNode;
