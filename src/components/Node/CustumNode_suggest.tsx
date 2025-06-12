import { useCallback, useRef, useEffect, type ChangeEvent } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Lightbulb } from 'lucide-react'; 

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
        relative w-full rounded-xl border-2 p-3 transition-all
        bg-gradient-to-br from-emerald-500/30 to-lime-400/10
        backdrop-blur-sm backdrop-saturate-150
        ${selected
          ? 'border-emerald-400 shadow-[0_0_16px_4px_rgba(16,185,129,0.75)]'
          : 'border-emerald-300/40'}
        ${!data.label?.trim() && 'opacity-70'}      /* 未入力ならうすく */
      `}
    >
      {/* ── SUGGEST バッジ ── */}
      <div
        className="
          absolute -top-3 left-3 flex items-center gap-1
          rounded-full bg-emerald-500 px-2 py-0.5
          text-xs font-semibold text-white shadow-md
        "
      >
        <Lightbulb className="h-3 w-3" />
        SUGGEST
      </div>

      {/* ── Handles & textarea ── */}
      <Handle type="target" position={Position.Top} />

      <textarea
        rows={1}
        ref={taRef}
        placeholder="サジェスト内容"
        value={data.label}
        onChange={handleChange}
        className="
          mt-4 w-full resize-none overflow-hidden rounded-md border-2
          border-dashed border-emerald-400/60 bg-transparent p-2
          text-sm font-medium text-gray-100 placeholder-emerald-200
          outline-none focus:border-solid
        "
      />

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}

export default TextSuggestNode;
