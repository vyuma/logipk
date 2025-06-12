import { useCallback, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function TextUpdaterNode() {
  /** textarea への参照 */
  const taRef = useRef<HTMLTextAreaElement>(null);

  /** 入力時に高さを合わせて伸ばす */
  const autoResize = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    // 一度 height をリセットしてから scrollHeight に合わせる
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    console.log(el.value);
  }, []);

  return (
    <div className="w-full rounded-lg bg-gray-100 p-2 shadow-md">
      {/* ── IN ハンドル ── */}
      <Handle type="target" position={Position.Top} />

      {/* ── textarea ── */}
      <textarea
        ref={taRef}
        className="nodrag mt-1 w-full resize-none overflow-hidden rounded-md border border-gray-300 p-2 text-sm focus:outline-none"
        placeholder="Type here..."
        value={"例: こんにちは、世界！"} // ← 初期値を設定
        rows={1}                     // ← 最低 1 行
        onChange={autoResize}        // ← 高さ調整
      />

      {/* ── OUT ハンドル ── */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}

export default TextUpdaterNode;
