import { useCallback, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function TextSuggestNode() {
  const taRef = useRef<HTMLTextAreaElement>(null);

  /** 入力に合わせて textarea の高さを自動拡張 */
  const autoResize = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  return (
    <div
      /* ── サジェスト感のある半透明カード ── */
      className="
        w-full rounded-lg border border-gray-400/50 border-dashed
        bg-white/60 backdrop-blur-sm shadow-sm
        ring-1 ring-inset ring-white/30
        p-2
        transition-colors
        hover:bg-white/70
      "
    >
      {/* ── IN ハンドル ── */}
      <Handle type="target" position={Position.Top} />

      {/* ── textarea ── */}
      <textarea
        ref={taRef}
        className="
          nodrag mt-1 w-full resize-none overflow-hidden
          rounded-md bg-transparent p-2 text-sm
          placeholder:text-gray-500/70
          focus:outline-none
        "
        placeholder="Type here..."
        rows={1}
        onChange={autoResize}
      />

      {/* ── OUT ハンドル ── */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}

export default TextSuggestNode;
